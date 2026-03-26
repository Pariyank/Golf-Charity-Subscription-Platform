const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// 1. ABSOLUTE FIRST PRIORITY: CORS
// This handles the "Preflight" requests that are currently failing in your log
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://golf-charity-platform.web.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 2. STRIPE WEBHOOK (Must be before express.json)
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  require("./controllers/stripeController").handleWebhook
);

// 3. BODY PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. DIAGNOSTIC LOGGER
app.use((req, res, next) => {
  console.log(`[LOG] ${new Date().toISOString()} | ${req.method} | ${req.url}`);
  next();
});

// 5. ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stripe", require("./routes/stripeRoutes"));
app.use("/api/scores", require("./routes/scoreRoutes"));
app.use("/api/charities", require("./routes/charityRoutes"));
app.use("/api/draws", require("./routes/drawRoutes"));
app.use("/api/winners", require("./routes/winnerRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

// Root Health Check
app.get("/", (req, res) => {
  res.status(200).json({ status: "API is active", version: "1.0.0" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Production Server Running on Port ${PORT}`));