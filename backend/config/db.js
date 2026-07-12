const { PrismaClient } = require("@prisma/client");

// Single shared Prisma client instance. Prevents exhausting MySQL
// connections when the Tailscale link adds extra round-trip latency
// and requests overlap (hot-reload in dev creates multiple clients
// otherwise).
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prismaFleet ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaFleet = prisma;
}

module.exports = prisma;
