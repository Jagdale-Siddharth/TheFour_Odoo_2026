const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return success(res, "User registered successfully", result, 201);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return success(res, "Login successful", result, 200);
});

const logout = asyncHandler(async (req, res) => {
  // Stateless JWT: logout is handled client-side by discarding the token.
  // Placeholder kept here in case token blacklisting is added later.
  return success(res, "Logout successful", {}, 200);
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  return success(res, "Current user fetched", user, 200);
});

module.exports = { register, login, logout, me };
