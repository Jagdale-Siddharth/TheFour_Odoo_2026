// ============================================================
// STUB ONLY - for running/testing this module independently.
//
// Per the master guide, authentication/JWT/RBAC belong to Member 1.
// Do not treat this file as the real thing to ship - once Member 1's
// actual authMiddleware exists on `develop`, delete this file and
// import theirs instead. The exported function names/signatures
// below match the common pattern so swapping is a one-line change
// in routes/index.js.
// ============================================================

const jwt = require("jsonwebtoken");
const { failure } = require("../utils/apiResponse");

function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return failure(res, "Authentication required", 401);
  }
  const token = header.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return failure(res, "Invalid or expired session", 401);
  }
}

// Never trust a role sent from the frontend - this only reads the
// role embedded in the verified JWT payload.
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return failure(res, "You do not have permission to perform this action", 403);
    }
    next();
  };
}

module.exports = { verifyToken, requireRole };
