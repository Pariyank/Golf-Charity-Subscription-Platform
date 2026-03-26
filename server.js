const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

console.log("✅ Server starting...");

// =======================================
// 🔥 GLOBAL CORS + PREFLIGHT (FINAL FIX)
// =======================================
const allowedOrigins = [
  "http://localhost:3000",
  "https://golf-charity-platform.web.app",
  "https://golf-charity-platform.firebaseapp.com"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Always log origin (DEBUG)
  console.log("Incoming Origin:", origin);

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // 🔥 CRITICAL: Handle OPTIONS BEFORE ANYTHING ELSE
  if (req.method === "OPTIONS") {
    console.log("✅ Preflight handled");
    return res.status(200).end();
  }

  next();
});

// =======================================
// 🔥 STRIPE WEBHOOK (RAW BODY ONLY HERE)
// =======================================
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  require("./controllers/stripeController").handleWebhook
);

// =======================================
// BODY PARSERS
// =======================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================================
// LOGGER
// =======================================
app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.url}`);
  next();
});

// =======================================
// ROUTES
// =======================================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stripe", require("./routes/stripeRoutes"));
app.use("/api/scores", require("./routes/scoreRoutes"));
app.use("/api/charities", require("./routes/charityRoutes"));
app.use("/api/draws", require("./routes/drawRoutes"));
app.use("/api/winners", require("./routes/winnerRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

// =======================================
// HEALTH CHECK
// =======================================
app.get("/", (req, res) => {
  res.json({ status: "API running 🚀" });
});

// =======================================
// SERVER START (RENDER FIX)
// =======================================
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});