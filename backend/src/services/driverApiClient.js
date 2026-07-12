const axios = require("axios");
const AppError = require("../utils/AppError");

// -----------------------------------------------------------------------------
// Integration boundary with Member 2 (Driver CRUD owner). Same pattern as
// vehicleApiClient.js - never query a Driver table directly.
//
// ASSUMED CONTRACT (confirm with Member 2, adjust here if different):
//   GET   /drivers/:id         -> { success, message, data: { id, licenseExpiryDate, status, ... } }
//   PATCH /drivers/:id/status  -> { success, message, data: { id, status } }
// -----------------------------------------------------------------------------

const client = axios.create({
  baseURL: process.env.VEHICLE_DRIVER_API_BASE_URL,
  timeout: 5000,
});

function withAuth(authHeader) {
  return authHeader ? { headers: { Authorization: authHeader } } : {};
}

async function getDriverById(driverId, authHeader) {
  try {
    const res = await client.get(`/drivers/${driverId}`, withAuth(authHeader));
    return res.data.data;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new AppError("Driver does not exist", 404);
    }
    throw new AppError("Unable to reach driver service", 502);
  }
}

async function setDriverStatus(driverId, status, authHeader) {
  try {
    const res = await client.patch(`/drivers/${driverId}/status`, { status }, withAuth(authHeader));
    return res.data.data;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new AppError("Driver does not exist", 404);
    }
    throw new AppError("Unable to update driver status", 502);
  }
}

module.exports = { getDriverById, setDriverStatus };
