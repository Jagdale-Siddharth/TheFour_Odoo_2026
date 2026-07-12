const express = require('express');
const { pool } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

router.get('/kpis', async (req, res) => {
  try {
    const { region, type } = req.query;
    const vClauses = [];
    const vParams = [];
    if (region) { vParams.push(region); vClauses.push(`region = $${vParams.length}`); }
    if (type) { vParams.push(type); vClauses.push(`type = $${vParams.length}`); }
    const vWhere = vClauses.length ? `WHERE ${vClauses.join(' AND ')}` : '';

    const vehicleCounts = await pool.query(
      `SELECT status, COUNT(*) FROM vehicles ${vWhere} GROUP BY status`, vParams
    );
    const driverCounts = await pool.query(`SELECT status, COUNT(*) FROM drivers GROUP BY status`);
    const tripCounts = await pool.query(`SELECT status, COUNT(*) FROM trips GROUP BY status`);
    const totalVehicles = await pool.query(`SELECT COUNT(*) FROM vehicles ${vWhere}`, vParams);

    const counts = {};
    vehicleCounts.rows.forEach((r) => { counts[r.status] = Number(r.count); });
    const driverStatusCounts = {};
    driverCounts.rows.forEach((r) => { driverStatusCounts[r.status] = Number(r.count); });
    const tripStatusCounts = {};
    tripCounts.rows.forEach((r) => { tripStatusCounts[r.status] = Number(r.count); });

    const total = Number(totalVehicles.rows[0].count) || 0;
    const active = (counts['Available'] || 0) + (counts['On Trip'] || 0);
    const utilization = total > 0 ? ((counts['On Trip'] || 0) / total) * 100 : 0;

    res.json({
      activeVehicles: active,
      availableVehicles: counts['Available'] || 0,
      vehiclesInMaintenance: counts['In Shop'] || 0,
      onTripVehicles: counts['On Trip'] || 0,
      retiredVehicles: counts['Retired'] || 0,
      activeTrips: tripStatusCounts['Dispatched'] || 0,
      pendingTrips: tripStatusCounts['Draft'] || 0,
      completedTrips: tripStatusCounts['Completed'] || 0,
      cancelledTrips: tripStatusCounts['Cancelled'] || 0,
      driversOnDuty: driverStatusCounts['On Trip'] || 0,
      driversAvailable: driverStatusCounts['Available'] || 0,
      fleetUtilization: Number(utilization.toFixed(1)),
      totalVehicles: total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute KPIs' });
  }
});

router.get('/filters', async (req, res) => {
  const types = await pool.query(`SELECT DISTINCT type FROM vehicles ORDER BY type`);
  const regions = await pool.query(`SELECT DISTINCT region FROM vehicles WHERE region IS NOT NULL ORDER BY region`);
  res.json({
    types: types.rows.map((r) => r.type),
    regions: regions.rows.map((r) => r.region),
  });
});

module.exports = router;
