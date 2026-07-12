const userService = require("../services/userService");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

const getUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await userService.getAllUsers({ page, limit });
  return success(res, "Users fetched successfully", result, 200);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return success(res, "User fetched successfully", user, 200);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  return success(res, "User updated successfully", user, 200);
});

const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  return success(res, "User deleted successfully", result, 200);
});

module.exports = { getUsers, getUserById, updateUser, deleteUser };
