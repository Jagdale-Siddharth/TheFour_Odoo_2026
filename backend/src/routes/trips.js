const express = require('express');
const { pool } = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

const TRIP_SELECT = `
  SELECT t.*, v.registration_number, v.name AS vehicle_name, v.max_load_capacity,
         d.name AS driver_name, d.license_number
  FROM trips t
  JOIN vehicles v ON v.id = t.vehicle_id
  JOIN drivers d ON d.id = t.driver_id
`;

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const params = [];
    let where = '';
    if (status) { params.push(status); where = `WHERE t.status = $1`; }
    const { rows } = await pool.query(`${TRIP_SELECT} ${where} ORDER BY t.created_at DESC`, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

router.get('/:id', async (req, res) => {
  const { rows } = await pool.query(`${TRIP_SELECT} WHERE t.id = $1`, [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Trip not found' });
  res.json(rows[0]);
});

// Create a trip in Draft status
router.post('/', authorize('FleetManager', 'Driver'), async (req, res) => {
  const client = await pool.connect();
  try {
    const { source, destination, vehicle_id, driver_id, cargo_weight, planned_distance } = req.body;
    if (!source || !destination || !vehicle_id || !driver_id || !cargo_weight || !planned_distance) {
      return res.status(400).json({ error: 'Source, destination, vehicle, driver, cargo weight and distance are all required' });
    }

    const vehicleRes = await client.query('SELECT * FROM vehicles WHERE id = $1', [vehicle_id]);
    const driverRes = await client.query('SELECT * FROM drivers WHERE id = $1', [driver_id]);
    if (!vehicleRes.rows.length) return res.status(404).json({ error: 'Vehicle not found' });
    if (!driverRes.rows.length) return res.status(404).json({ error: 'Driver not found' });
    const vehicle = vehicleRes.rows[0];
    const driver = driverRes.rows[0];

    if (cargo_weight > Number(vehicle.max_load_capacity)) {
      return res.status(400).json({ error: `Cargo weight (${cargo_weight}kg) exceeds vehicle's max load capacity (${vehicle.max_load_capacity}kg)` });
    }

    const { rows } = await client.query(
      `INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, status, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,'Draft',$7) RETURNING *`,
      [source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create trip' });
  } finally {
    client.release();
  }
});

// Dispatch a trip: Draft -> Dispatched, with full business rule validation
router.post('/:id/dispatch', authorize('FleetManager', 'Driver'), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const tripRes = await client.query('SELECT * FROM trips WHERE id = $1 FOR UPDATE', [req.params.id]);
    if (!tripRes.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Trip not found' }); }
    const trip = tripRes.rows[0];
    if (trip.status !== 'Draft') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `Only Draft trips can be dispatched (current status: ${trip.status})` });
    }

    const vehicleRes = await client.query('SELECT * FROM vehicles WHERE id = $1 FOR UPDATE', [trip.vehicle_id]);
    const driverRes = await client.query('SELECT * FROM drivers WHERE id = $1 FOR UPDATE', [trip.driver_id]);
    const vehicle = vehicleRes.rows[0];
    const driver = driverRes.rows[0];

    // Rule: Retired / In Shop vehicles never dispatched
    if (vehicle.status !== 'Available') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `Vehicle ${vehicle.registration_number} is not Available (status: ${vehicle.status})` });
    }
    // Rule: expired license or suspended driver cannot be assigned
    if (driver.status === 'Suspended') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `Driver ${driver.name} is Suspended and cannot be assigned` });
    }
    if (new Date(driver.license_expiry_date) < new Date()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `Driver ${driver.name}'s license has expired` });
    }
    if (driver.status !== 'Available') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `Driver ${driver.name} is not Available (status: ${driver.status})` });
    }
    // Rule: cargo weight vs capacity (re-validate at dispatch time too)
    if (Number(trip.cargo_weight) > Number(vehicle.max_load_capacity)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cargo weight exceeds vehicle max load capacity' });
    }

    await client.query(`UPDATE vehicles SET status = 'On Trip', updated_at = NOW() WHERE id = $1`, [vehicle.id]);
    await client.query(`UPDATE drivers SET status = 'On Trip', updated_at = NOW() WHERE id = $1`, [driver.id]);
    const updated = await client.query(
      `UPDATE trips SET status = 'Dispatched', dispatched_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *`,
      [trip.id]
    );
    await client.query('COMMIT');
    res.json(updated.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to dispatch trip' });
  } finally {
    client.release();
  }
});

// Complete a trip: Dispatched -> Completed
router.post('/:id/complete', authorize('FleetManager', 'Driver'), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { actual_distance, fuel_consumed, final_odometer, revenue } = req.body;
    const tripRes = await client.query('SELECT * FROM trips WHERE id = $1 FOR UPDATE', [req.params.id]);
    if (!tripRes.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Trip not found' }); }
    const trip = tripRes.rows[0];
    if (trip.status !== 'Dispatched') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `Only Dispatched trips can be completed (current status: ${trip.status})` });
    }

    await client.query(`UPDATE vehicles SET status = 'Available', updated_at = NOW()${final_odometer ? ', odometer = $2' : ''} WHERE id = $1`,
      final_odometer ? [trip.vehicle_id, final_odometer] : [trip.vehicle_id]);
    await client.query(`UPDATE drivers SET status = 'Available', updated_at = NOW() WHERE id = $1`, [trip.driver_id]);

    const updated = await client.query(
      `UPDATE trips SET status = 'Completed', completed_at = NOW(), updated_at = NOW(),
       actual_distance = COALESCE($2, actual_distance), fuel_consumed = COALESCE($3, fuel_consumed),
       revenue = COALESCE($4, revenue)
       WHERE id = $1 RETURNING *`,
      [trip.id, actual_distance || null, fuel_consumed || null, revenue || null]
    );

    if (fuel_consumed) {
      await client.query(
        `INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, log_date) VALUES ($1,$2,$3,$4,CURRENT_DATE)`,
        [trip.vehicle_id, trip.id, fuel_consumed, req.body.fuel_cost || 0]
      );
    }

    await client.query('COMMIT');
    res.json(updated.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to complete trip' });
  } finally {
    client.release();
  }
});

// Cancel a trip: Draft or Dispatched -> Cancelled
router.post('/:id/cancel', authorize('FleetManager', 'Driver'), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const tripRes = await client.query('SELECT * FROM trips WHERE id = $1 FOR UPDATE', [req.params.id]);
    if (!tripRes.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Trip not found' }); }
    const trip = tripRes.rows[0];
    if (!['Draft', 'Dispatched'].includes(trip.status)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `Only Draft or Dispatched trips can be cancelled (current status: ${trip.status})` });
    }

    if (trip.status === 'Dispatched') {
      await client.query(`UPDATE vehicles SET status = 'Available', updated_at = NOW() WHERE id = $1`, [trip.vehicle_id]);
      await client.query(`UPDATE drivers SET status = 'Available', updated_at = NOW() WHERE id = $1`, [trip.driver_id]);
    }

    const updated = await client.query(
      `UPDATE trips SET status = 'Cancelled', cancelled_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *`,
      [trip.id]
    );
    await client.query('COMMIT');
    res.json(updated.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel trip' });
  } finally {
    client.release();
  }
});

module.exports = router;
