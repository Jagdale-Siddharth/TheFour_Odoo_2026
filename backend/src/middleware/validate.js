const { failure } = require("../utils/apiResponse");

// Runs a Zod schema against req.body. Frontend also validates with the same
// kind of Zod schema, but this is the copy that's actually trusted.
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return failure(res, {
        message: firstIssue?.message || "Invalid input",
        statusCode: 422,
      });
    }

    req.body = result.data;
    next();
  };
}

module.exports = validate;
