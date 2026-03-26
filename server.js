const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// 1. NUCLEAR CORS OVERRIDE (Place this ABOVE EVERYTHING ELSE)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins for the meeting
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  // Handle Preflight (OPTIONS request)
  if (req.method === "OPTIONS") {
    return res.status(200).send();
  }
  next();
});

// 2. STRIPE WEBHOOK (Must be before express.json)
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  require("./controllers/stripeController").handleWebhook
);

// 3. BODY PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stripe", require("./routes/stripeRoutes"));
app.use("/api/scores", require("./routes/scoreRoutes"));
app.use("/api/charities", require("./routes/charityRoutes"));
app.use("/api/draws", require("./routes/drawRoutes"));
app.use("/api/winners", require("./routes/winnerRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

// Root Health Check
app.get("/", (req, res) => res.send("API ACTIVE 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server fully operational on port ${PORT}`));