const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const axios = require('axios');

setInterval(() => {
  axios.get('https://golf-charity-subscription-platform-yjzu.onrender.com/api/health')
    .then(() => console.log('Self-ping success'))
    .catch(() => {});
}, 600000);

dotenv.config();
console.log("🚀 SERVER BOOTING...");

const app = express();

const allowedOrigins = [
  "https://golf-charity-platform.web.app",
  "https://golf-charity-platform.firebaseapp.com"
];

app.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    require("./controllers/stripeController").handleWebhook(req, res);
  }
);

app.use(express.json());


app.use((req, res, next) => {
  console.log(`[INCOMING] ${req.method} ${req.url}`);
  next();
});

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