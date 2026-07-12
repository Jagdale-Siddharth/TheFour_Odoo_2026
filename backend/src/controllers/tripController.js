const tripService = require("../services/tripService");
const { success } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getAuthHeader = (req) => req.headers.authorization;

const listTrips = asyncHandler(async (req, res) => {
  const { page, pageSize, ...filters } = req.query;
  const result = await tripService.listTrips(filters, {
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 20,
  });
  return success(res, { message: "Trips fetched", data: result });
});

const getTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.getTripById(req.params.id);
  return success(res, { message: "Trip fetched", data: trip });
});

const createTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.createTrip(req.body, req.user.id, getAuthHeader(req));
  return success(res, { message: "Trip created", data: trip, statusCode: 201 });
});

const updateTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.updateTrip(req.params.id, req.body);
  return success(res, { message: "Trip updated", data: trip });
});

const deleteTrip = asyncHandler(async (req, res) => {
  await tripService.deleteTrip(req.params.id);
  return success(res, { message: "Trip deleted" });
});

const dispatchTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.dispatchTrip(req.params.id, getAuthHeader(req));
  return success(res, { message: "Trip dispatched", data: trip });
});

const completeTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.completeTrip(req.params.id, req.body, getAuthHeader(req));
  return success(res, { message: "Trip completed", data: trip });
});

const cancelTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.cancelTrip(req.params.id, getAuthHeader(req));
  return success(res, { message: "Trip cancelled", data: trip });
});

module.exports = {
  listTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
};
