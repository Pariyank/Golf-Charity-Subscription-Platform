const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");

require("./jobs/drawJob");

dotenv.config();

const app = express();
connectDB();

app.use(helmet());
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api/auth/login", limiter);

app.post(
  "/api/stripe/webhook",
  require("express").raw({ type: "application/json" }),
  require("./controllers/stripeController").handleWebhook
);


app.use(cors({
  origin: ["https://your-project-id.web.app", "https://your-project-id.firebaseapp.com"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stripe", require("./routes/stripeRoutes"));
app.use("/api/scores", require("./routes/scoreRoutes"));
app.use("/api/charities", require("./routes/charityRoutes"));
app.use("/api/draws", require("./routes/drawRoutes"));
app.use("/api/winners", require("./routes/winnerRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.listen(5000, () => console.log("Server running on port 5000"));