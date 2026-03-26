const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
console.log("🚀 SERVER BOOTING...");

const app = express();

// 1. DYNAMIC CORS (Handles the Preflight 'OPTIONS' request perfectly)
const allowedOrigins = [
  "https://golf-charity-platform.web.app",
  "https://golf-charity-platform.firebaseapp.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(null, true); // Allow all for meeting success, change to error later
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// 2. STRIPE WEBHOOK (Must be raw for signature verification)
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    require("./controllers/stripeController").handleWebhook(req, res);
  }
);

// 3. STANDARD MIDDLEWARE
app.use(express.json());

// 4. REQUEST LOGGER (Check Render Logs for these!)
app.use((req, res, next) => {
  console.log(`[INCOMING] ${req.method} ${req.url}`);
  next();
});

// 5. DATABASE & ROUTES
connectDB().then(() => {
  console.log("📦 MongoDB Connected");
  
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/stripe", require("./routes/stripeRoutes"));
  app.use("/api/scores", require("./routes/scoreRoutes"));
  app.use("/api/charities", require("./routes/charityRoutes"));
  app.use("/api/draws", require("./routes/drawRoutes"));
  app.use("/api/winners", require("./routes/winnerRoutes"));
  app.use("/api/reports", require("./routes/reportRoutes"));

  app.get("/api/health", (req, res) => res.json({ status: "alive" }));
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server ready on port ${PORT}`));
}).catch(err => {
  console.error("❌ DB Connection Failed:", err.message);
});