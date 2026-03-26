const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// 1. WEBHOOK (Must be before body parsers)
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  require("./controllers/stripeController").handleWebhook
);

// 2. AGGRESSIVE CORS OVERRIDE (Fulfills Requirement 13)
// This manually sets headers for every single request
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://golf-charity-platform.web.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  // Handle Preflight (The 'OPTIONS' request the browser sends first)
  if (req.method === "OPTIONS") {
    return res.status(200).send();
  }
  next();
});

// Also use the standard CORS library as a secondary layer
app.use(cors({
  origin: "https://golf-charity-platform.web.app",
  credentials: true
}));

app.use(express.json());

// 3. SAFE LOGGER (Will not crash on GET requests)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    console.log("Payload detected in request body");
  }
  next();
});

// 4. ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stripe", require("./routes/stripeRoutes"));
app.use("/api/scores", require("./routes/scoreRoutes"));
app.use("/api/charities", require("./routes/charityRoutes"));
app.use("/api/draws", require("./routes/drawRoutes"));
app.use("/api/winners", require("./routes/winnerRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

app.get("/", (req, res) => res.send("API Heartbeat: Online 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server fully operational on port ${PORT}`));