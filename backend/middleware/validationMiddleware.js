// Generic Zod validation middleware.
// Usage: router.post("/register", validate(registerSchema), authController.register)

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return res.status(422).json({
        success: false,
        message: firstIssue.message || "Validation failed",
      });
    }

    req.body = result.data;
    next();
  };
}

module.exports = validate;
