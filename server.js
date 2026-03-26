const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const stripeController = require("./controllers/stripeController");

dotenv.config();
connectDB();

const app = express();

// A. CORS CONFIGURATION
app.use(cors({
  origin: [
    "https://golf-charity-platform.web.app", 
    "https://golf-charity-platform.firebaseapp.com",
    "http://localhost:3000"
  ],
  credentials: true
}));

// B. STRIPE WEBHOOK (MUST BE BEFORE express.json())
// Stripe needs the RAW body to verify the signature. 
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }), 
  stripeController.handleWebhook
);

// C. STANDARD MIDDLEWARE
app.use(express.json());

// D. ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stripe", require("./routes/stripeRoutes"));
app.use("/api/scores", require("./routes/scoreRoutes"));
app.use("/api/charities", require("./routes/charityRoutes"));
app.use("/api/draws", require("./routes/drawRoutes"));
app.use("/api/winners", require("./routes/winnerRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));