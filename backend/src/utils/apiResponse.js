// Enforces the single response shape the whole team agreed on:
// { success, message, data } for both success and error paths.

function success(res, { message = "Success", data = null, statusCode = 200 } = {}) {
  return res.status(statusCode).json({ success: true, message, data });
}

function failure(res, { message = "Something went wrong", statusCode = 400, data = null } = {}) {
  return res.status(statusCode).json({ success: false, message, data });
}

module.exports = { success, failure };
