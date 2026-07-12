const express = require('express');
const { pool } = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

const SELECT = `
  SELECT m.*, v.registration_number, v.name AS vehicle_name
  FROM maintenance_logs m JOIN vehicles v ON v.id = m.vehicle_id
`;

router.get('/', async (req, res) => {
  const { status } = req.query;
  const params = [];
  let where = '';
  if (status) { params.push(status); where = `WHERE m.status = $1`; }
  const { rows } = await pool.query(`${SELECT} ${where} ORDER BY m.created_at DESC`, params);
  res.json(rows);
});

router.post('/', authorize('FleetManager'), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { vehicle_id, service_type, description, cost } = req.body;
    if (!vehicle_id || !service_type) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Vehicle and service type are required' });
    }
    const vehicleRes = await client.query('SELECT * FROM vehicles WHERE id = $1 FOR UPDATE', [vehicle_id]);
    if (!vehicleRes.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Vehicle not found' }); }
    const vehicle = vehicleRes.rows[0];
    if (vehicle.status === 'On Trip') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot create a maintenance record for a vehicle that is currently On Trip' });
    }

    const log = await client.query(
      `INSERT INTO maintenance_logs (vehicle_id, service_type, description, cost, status)
       VALUES ($1,$2,$3,$4,'Open') RETURNING *`,
      [vehicle_id, service_type, description || null, cost || 0]
    );
    // Rule: creating an active maintenance record automatically switches vehicle to In Shop
    await client.query(`UPDATE vehicles SET status = 'In Shop', updated_at = NOW() WHERE id = $1`, [vehicle_id]);

    await client.query('COMMIT');
    res.status(201).json(log.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to create maintenance record' });
  } finally {
    client.release();
  }
});

// Close a maintenance record -> vehicle back to Available (unless retired)
router.post('/:id/close', authorize('FleetManager'), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { final_cost } = req.body;
    const logRes = await client.query('SELECT * FROM maintenance_logs WHERE id = $1 FOR UPDATE', [req.params.id]);
    if (!logRes.rows.length) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Maintenance record not found' }); }
    const log = logRes.rows[0];
    if (log.status === 'Closed') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'This maintenance record is already closed' });
    }

    const updated = await client.query(
      `UPDATE maintenance_logs SET status = 'Closed', closed_at = NOW(), cost = COALESCE($2, cost) WHERE id = $1 RETURNING *`,
      [log.id, final_cost || null]
    );

    const vehicleRes = await client.query('SELECT * FROM vehicles WHERE id = $1', [log.vehicle_id]);
    if (vehicleRes.rows[0].status !== 'Retired') {
      await client.query(`UPDATE vehicles SET status = 'Available', updated_at = NOW() WHERE id = $1`, [log.vehicle_id]);
    }

    await client.query('COMMIT');
    res.json(updated.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to close maintenance record' });
  } finally {
    client.release();
  }
});

module.exports = router;
