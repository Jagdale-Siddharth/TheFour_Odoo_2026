const { failure } = require("../utils/apiResponse");

// Backend re-validates everything the frontend already checked -
// never trust the client. Wraps a Zod schema as Express middleware.
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return failure(res, firstIssue.message, 422);
    }
    req.body = result.data;
    next();
  };
}

module.exports = validate;
