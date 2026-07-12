const express = require('express');
const { pool } = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  const { vehicle_id } = req.query;
  const params = [];
  let where = '';
  if (vehicle_id) { params.push(vehicle_id); where = `WHERE f.vehicle_id = $1`; }
  const { rows } = await pool.query(
    `SELECT f.*, v.registration_number, v.name AS vehicle_name FROM fuel_logs f
     JOIN vehicles v ON v.id = f.vehicle_id ${where} ORDER BY f.log_date DESC`,
    params
  );
  res.json(rows);
});

router.post('/', authorize('FleetManager', 'Driver'), async (req, res) => {
  try {
    const { vehicle_id, trip_id, liters, cost, log_date } = req.body;
    if (!vehicle_id || !liters || !cost) {
      return res.status(400).json({ error: 'Vehicle, liters and cost are required' });
    }
    const { rows } = await pool.query(
      `INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, log_date)
       VALUES ($1,$2,$3,$4,COALESCE($5, CURRENT_DATE)) RETURNING *`,
      [vehicle_id, trip_id || null, liters, cost, log_date || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record fuel log' });
  }
});

module.exports = router;
