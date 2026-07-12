// Format: TRIP-YYYYMMDD-XXXX (XXXX = random 4-digit segment).
// Uniqueness is enforced at the DB level (Trip.tripNumber is @unique);
// on the rare collision, the repository layer retries generation once.
function generateTripNumber() {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `TRIP-${datePart}-${randomPart}`;
}

module.exports = generateTripNumber;
