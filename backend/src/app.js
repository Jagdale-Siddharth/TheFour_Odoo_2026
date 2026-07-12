const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const { failure } = require("./utils/apiResponse");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use((req, res) => failure(res, { message: "Route not found", statusCode: 404 }));

// Must be registered last.
app.use(errorHandler);

module.exports = app;
