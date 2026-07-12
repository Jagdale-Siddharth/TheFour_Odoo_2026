const { PrismaClient } = require("@prisma/client");

// Singleton so we don't exhaust MySQL connections across hot reloads / requests.
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

module.exports = prisma;
