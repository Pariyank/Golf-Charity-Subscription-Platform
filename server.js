const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

console.log("✅ CORS CONFIG LOADED");

const allowedOrigins = [
  "http://localhost:3000",
  "https://golf-charity-platform.web.app",
  "https://golf-charity-platform.firebaseapp.com"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  require("./controllers/stripeController").handleWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[LOG] ${new Date().toISOString()} | ${req.method} | ${req.url}`);
  next();
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stripe", require("./routes/stripeRoutes"));
app.use("/api/scores", require("./routes/scoreRoutes"));
app.use("/api/charities", require("./routes/charityRoutes"));
app.use("/api/draws", require("./routes/drawRoutes"));
app.use("/api/winners", require("./routes/winnerRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

app.get("/", (req, res) => {
  res.status(200).json({ status: "API is active", version: "1.0.0" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Production Server Running on Port ${PORT}`));