const axios = require("axios");
const AppError = require("../utils/AppError");

// -----------------------------------------------------------------------------
// Integration boundary with Member 2 (Vehicle CRUD owner).
// We never query a Vehicle table directly - this file is the single place
// that talks to their API. If their actual route names/response shape differ
// from what's assumed below, this is the only file that needs to change.
//
// ASSUMED CONTRACT (confirm with Member 2, adjust here if different):
//   GET   /vehicles/:id           -> { success, message, data: { id, registrationNumber, status, capacity, ... } }
//   PATCH /vehicles/:id/status    -> { success, message, data: { id, status } }
// -----------------------------------------------------------------------------

const client = axios.create({
  baseURL: process.env.VEHICLE_DRIVER_API_BASE_URL,
  timeout: 5000,
});

// Forwards the caller's auth token so Member 2's API sees the same identity/RBAC.
function withAuth(authHeader) {
  return authHeader ? { headers: { Authorization: authHeader } } : {};
}

async function getVehicleById(vehicleId, authHeader) {
  try {
    const res = await client.get(`/vehicles/${vehicleId}`, withAuth(authHeader));
    return res.data.data;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new AppError("Vehicle does not exist", 404);
    }
    throw new AppError("Unable to reach vehicle service", 502);
  }
}

async function setVehicleStatus(vehicleId, status, authHeader) {
  try {
    const res = await client.patch(`/vehicles/${vehicleId}/status`, { status }, withAuth(authHeader));
    return res.data.data;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new AppError("Vehicle does not exist", 404);
    }
    throw new AppError("Unable to update vehicle status", 502);
  }
}

module.exports = { getVehicleById, setVehicleStatus };
