const express = require('express');
const { pool } = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// GET all vehicles (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { type, status, region, search } = req.query;
    const clauses = [];
    const params = [];
    if (type) { params.push(type); clauses.push(`type = $${params.length}`); }
    if (status) { params.push(status); clauses.push(`status = $${params.length}`); }
    if (region) { params.push(region); clauses.push(`region = $${params.length}`); }
    if (search) {
      params.push(`%${search}%`);
      clauses.push(`(registration_number ILIKE $${params.length} OR name ILIKE $${params.length})`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT * FROM vehicles ${where} ORDER BY created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// GET vehicles eligible for dispatch (Available only)
router.get('/available', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM vehicles WHERE status = 'Available' ORDER BY name`
  );
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM vehicles WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Vehicle not found' });
  res.json(rows[0]);
});

router.post('/', authorize('FleetManager'), async (req, res) => {
  try {
    const { registration_number, name, type, max_load_capacity, odometer, acquisition_cost, status, region } = req.body;
    if (!registration_number || !name || !type || !max_load_capacity) {
      return res.status(400).json({ error: 'Registration number, name, type and max load capacity are required' });
    }
    const dup = await pool.query('SELECT id FROM vehicles WHERE registration_number = $1', [registration_number]);
    if (dup.rows.length) {
      return res.status(409).json({ error: 'A vehicle with this registration number already exists' });
    }
    const { rows } = await pool.query(
      `INSERT INTO vehicles (registration_number, name, type, max_load_capacity, odometer, acquisition_cost, status, region)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [registration_number, name, type, max_load_capacity, odometer || 0, acquisition_cost || 0, status || 'Available', region || 'Central']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
});

router.put('/:id', authorize('FleetManager'), async (req, res) => {
  try {
    const { name, type, max_load_capacity, odometer, acquisition_cost, status, region } = req.body;
    const existing = await pool.query('SELECT * FROM vehicles WHERE id = $1', [req.params.id]);
    if (!existing.rows.length) return res.status(404).json({ error: 'Vehicle not found' });
    if (existing.rows[0].status === 'On Trip' && status && status !== 'On Trip') {
      return res.status(400).json({ error: 'Cannot manually change status of a vehicle that is currently On Trip' });
    }
    const { rows } = await pool.query(
      `UPDATE vehicles SET name=$1, type=$2, max_load_capacity=$3, odometer=$4,
       acquisition_cost=$5, status=$6, region=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [name, type, max_load_capacity, odometer, acquisition_cost, status, region, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

router.delete('/:id', authorize('FleetManager'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE vehicles SET status = 'Retired', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ message: 'Vehicle retired', vehicle: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retire vehicle' });
  }
});

module.exports = router;
