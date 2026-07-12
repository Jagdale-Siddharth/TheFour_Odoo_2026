const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TransitOps trip-engine module running on port ${PORT}`);
});
