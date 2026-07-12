const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

// This module does NOT implement authentication - Member 1 owns login/signup
// and token issuance. We only verify the token here so our routes can trust
// req.user.id / req.user.role. Uses the same JWT_SECRET the whole team shares.
function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Authentication required", 401));
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // expected shape: { id, role, ... } from Member 1
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired session", 401));
  }
}

// Role middleware only - never trust a role sent from the frontend.
// Usage: authorize("Dispatcher", "Fleet Manager")
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }
    next();
  };
}

module.exports = { authenticate, authorize };
