const { PrismaClient } = require("@prisma/client");

// Single shared Prisma instance for the whole app.
// Every repository must import prisma from here — never instantiate a new client elsewhere.
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

module.exports = prisma;
