const express = require('express');
const { pool } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// Per-vehicle analytics: fuel efficiency, utilization, operational cost, ROI
router.get('/vehicle-analytics', async (req, res) => {
  try {
    const { rows: vehicles } = await pool.query('SELECT * FROM vehicles ORDER BY name');
    const results = [];

    for (const v of vehicles) {
      const fuelRes = await pool.query(
        `SELECT COALESCE(SUM(liters),0) AS liters, COALESCE(SUM(cost),0) AS cost FROM fuel_logs WHERE vehicle_id = $1`,
        [v.id]
      );
      const maintRes = await pool.query(
        `SELECT COALESCE(SUM(cost),0) AS cost FROM maintenance_logs WHERE vehicle_id = $1`,
        [v.id]
      );
      const expenseRes = await pool.query(
        `SELECT COALESCE(SUM(amount),0) AS amount FROM expenses WHERE vehicle_id = $1`,
        [v.id]
      );
      const tripRes = await pool.query(
        `SELECT COALESCE(SUM(actual_distance),0) AS distance, COALESCE(SUM(revenue),0) AS revenue, COUNT(*) AS trip_count
         FROM trips WHERE vehicle_id = $1 AND status = 'Completed'`,
        [v.id]
      );

      const fuelLiters = Number(fuelRes.rows[0].liters);
      const fuelCost = Number(fuelRes.rows[0].cost);
      const maintCost = Number(maintRes.rows[0].cost);
      const expenseAmount = Number(expenseRes.rows[0].amount);
      const distance = Number(tripRes.rows[0].distance);
      const revenue = Number(tripRes.rows[0].revenue);
      const tripCount = Number(tripRes.rows[0].trip_count);

      const operationalCost = fuelCost + maintCost + expenseAmount;
      const fuelEfficiency = fuelLiters > 0 ? distance / fuelLiters : null;
      const acquisitionCost = Number(v.acquisition_cost) || 0;
      const roi = acquisitionCost > 0 ? ((revenue - (maintCost + fuelCost)) / acquisitionCost) * 100 : null;

      results.push({
        vehicle_id: v.id,
        registration_number: v.registration_number,
        name: v.name,
        type: v.type,
        status: v.status,
        trip_count: tripCount,
        distance,
        fuelLiters,
        fuelCost,
        maintCost,
        expenseAmount,
        operationalCost,
        revenue,
        fuelEfficiency: fuelEfficiency !== null ? Number(fuelEfficiency.toFixed(2)) : null,
        roi: roi !== null ? Number(roi.toFixed(2)) : null,
      });
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute analytics' });
  }
});

// Fleet-wide summary over time (for charts)
router.get('/fleet-summary', async (req, res) => {
  try {
    const monthlyFuel = await pool.query(`
      SELECT to_char(log_date, 'YYYY-MM') AS month, SUM(cost) AS fuel_cost, SUM(liters) AS liters
      FROM fuel_logs GROUP BY month ORDER BY month
    `);
    const monthlyMaint = await pool.query(`
      SELECT to_char(started_at, 'YYYY-MM') AS month, SUM(cost) AS maint_cost
      FROM maintenance_logs GROUP BY month ORDER BY month
    `);
    const monthlyTrips = await pool.query(`
      SELECT to_char(created_at, 'YYYY-MM') AS month, COUNT(*) AS trip_count,
             SUM(CASE WHEN status = 'Completed' THEN revenue ELSE 0 END) AS revenue
      FROM trips GROUP BY month ORDER BY month
    `);
    res.json({
      monthlyFuel: monthlyFuel.rows,
      monthlyMaint: monthlyMaint.rows,
      monthlyTrips: monthlyTrips.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute fleet summary' });
  }
});

// CSV export of vehicle analytics
router.get('/export/csv', async (req, res) => {
  try {
    const { rows: vehicles } = await pool.query('SELECT * FROM vehicles ORDER BY name');
    const lines = ['Registration,Name,Type,Status,TripCount,Distance,FuelLiters,FuelCost,MaintCost,OperationalCost,Revenue,FuelEfficiency,ROI(%)'];

    for (const v of vehicles) {
      const fuelRes = await pool.query(`SELECT COALESCE(SUM(liters),0) l, COALESCE(SUM(cost),0) c FROM fuel_logs WHERE vehicle_id=$1`, [v.id]);
      const maintRes = await pool.query(`SELECT COALESCE(SUM(cost),0) c FROM maintenance_logs WHERE vehicle_id=$1`, [v.id]);
      const expRes = await pool.query(`SELECT COALESCE(SUM(amount),0) a FROM expenses WHERE vehicle_id=$1`, [v.id]);
      const tripRes = await pool.query(`SELECT COALESCE(SUM(actual_distance),0) d, COALESCE(SUM(revenue),0) r, COUNT(*) c FROM trips WHERE vehicle_id=$1 AND status='Completed'`, [v.id]);

      const fuelLiters = Number(fuelRes.rows[0].l);
      const fuelCost = Number(fuelRes.rows[0].c);
      const maintCost = Number(maintRes.rows[0].c);
      const expAmount = Number(expRes.rows[0].a);
      const distance = Number(tripRes.rows[0].d);
      const revenue = Number(tripRes.rows[0].r);
      const tripCount = Number(tripRes.rows[0].c);
      const operationalCost = fuelCost + maintCost + expAmount;
      const fuelEff = fuelLiters > 0 ? (distance / fuelLiters).toFixed(2) : '';
      const acqCost = Number(v.acquisition_cost) || 0;
      const roi = acqCost > 0 ? (((revenue - (maintCost + fuelCost)) / acqCost) * 100).toFixed(2) : '';

      lines.push([
        v.registration_number, v.name, v.type, v.status, tripCount, distance,
        fuelLiters, fuelCost, maintCost, operationalCost, revenue, fuelEff, roi
      ].join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transitops-report.csv"');
    res.send(lines.join('\n'));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

module.exports = router;
