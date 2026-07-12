const express = require('express');
const { pool } = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const { status, region, search } = req.query;
    const clauses = [];
    const params = [];
    if (status) { params.push(status); clauses.push(`status = $${params.length}`); }
    if (region) { params.push(region); clauses.push(`region = $${params.length}`); }
    if (search) {
      params.push(`%${search}%`);
      clauses.push(`(name ILIKE $${params.length} OR license_number ILIKE $${params.length})`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const { rows } = await pool.query(`SELECT * FROM drivers ${where} ORDER BY created_at DESC`, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// Drivers eligible for dispatch: Available, not suspended, license not expired
router.get('/available', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM drivers WHERE status = 'Available' AND license_expiry_date >= CURRENT_DATE ORDER BY name`
  );
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM drivers WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Driver not found' });
  res.json(rows[0]);
});

router.post('/', authorize('FleetManager', 'SafetyOfficer'), async (req, res) => {
  try {
    const { name, license_number, license_category, license_expiry_date, contact_number, safety_score, status, region } = req.body;
    if (!name || !license_number || !license_category || !license_expiry_date) {
      return res.status(400).json({ error: 'Name, license number, category and expiry date are required' });
    }
    const dup = await pool.query('SELECT id FROM drivers WHERE license_number = $1', [license_number]);
    if (dup.rows.length) {
      return res.status(409).json({ error: 'A driver with this license number already exists' });
    }
    const { rows } = await pool.query(
      `INSERT INTO drivers (name, license_number, license_category, license_expiry_date, contact_number, safety_score, status, region)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, license_number, license_category, license_expiry_date, contact_number || null, safety_score || 100, status || 'Available', region || 'Central']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create driver' });
  }
});

router.put('/:id', authorize('FleetManager', 'SafetyOfficer'), async (req, res) => {
  try {
    const { name, license_category, license_expiry_date, contact_number, safety_score, status, region } = req.body;
    const existing = await pool.query('SELECT * FROM drivers WHERE id = $1', [req.params.id]);
    if (!existing.rows.length) return res.status(404).json({ error: 'Driver not found' });
    if (existing.rows[0].status === 'On Trip' && status && status !== 'On Trip') {
      return res.status(400).json({ error: 'Cannot manually change status of a driver that is currently On Trip' });
    }
    const { rows } = await pool.query(
      `UPDATE drivers SET name=$1, license_category=$2, license_expiry_date=$3, contact_number=$4,
       safety_score=$5, status=$6, region=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [name, license_category, license_expiry_date, contact_number, safety_score, status, region, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update driver' });
  }
});

router.delete('/:id', authorize('FleetManager', 'SafetyOfficer'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE drivers SET status = 'Suspended', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Driver not found' });
    res.json({ message: 'Driver suspended', driver: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to suspend driver' });
  }
});

module.exports = router;
