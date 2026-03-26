const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// 1. Webhook MUST stay above express.json()
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  require("./controllers/stripeController").handleWebhook
);

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Robust Logger (Fixed the crash)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Payload:", JSON.stringify(req.body));
  }
  next();
});

// 4. Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stripe", require("./routes/stripeRoutes"));
app.use("/api/scores", require("./routes/scoreRoutes"));
app.use("/api/charities", require("./routes/charityRoutes"));
app.use("/api/draws", require("./routes/drawRoutes"));
app.use("/api/winners", require("./routes/winnerRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

app.get("/", (req, res) => res.send("Golf API Live 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));