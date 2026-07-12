const AppError = require("../utils/AppError");

// RBAC middleware. Must run AFTER authMiddleware since it relies on req.user.
// Usage: router.get("/vehicles", authMiddleware, authorize(["FLEET_MANAGER"]), handler)

function authorize(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("You do not have permission to perform this action", 403);
    }

    next();
  };
}

module.exports = authorize;
