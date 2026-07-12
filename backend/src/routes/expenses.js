const express = require('express');
const { pool } = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  const { vehicle_id, category } = req.query;
  const clauses = [];
  const params = [];
  if (vehicle_id) { params.push(vehicle_id); clauses.push(`e.vehicle_id = $${params.length}`); }
  if (category) { params.push(category); clauses.push(`e.category = $${params.length}`); }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const { rows } = await pool.query(
    `SELECT e.*, v.registration_number, v.name AS vehicle_name FROM expenses e
     JOIN vehicles v ON v.id = e.vehicle_id ${where} ORDER BY e.expense_date DESC`,
    params
  );
  res.json(rows);
});

router.post('/', authorize('FleetManager', 'FinancialAnalyst', 'Driver'), async (req, res) => {
  try {
    const { vehicle_id, trip_id, category, amount, expense_date, notes } = req.body;
    if (!vehicle_id || !category || !amount) {
      return res.status(400).json({ error: 'Vehicle, category and amount are required' });
    }
    const { rows } = await pool.query(
      `INSERT INTO expenses (vehicle_id, trip_id, category, amount, expense_date, notes)
       VALUES ($1,$2,$3,$4,COALESCE($5, CURRENT_DATE),$6) RETURNING *`,
      [vehicle_id, trip_id || null, category, amount, expense_date || null, notes || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record expense' });
  }
});

module.exports = router;
