const User = require("../models/User");
const Draw = require("../models/Draw");
const Charity = require("../models/Charity");

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubs = await User.countDocuments({ subscriptionStatus: "active" });
    
    const draws = await Draw.find();
    const totalPrizePaid = draws.reduce((acc, draw) => {
      const paidInDraw = draw.results
        .filter(r => r.paymentStatus === "paid")
        .reduce((sum, r) => sum + r.prize, 0);
      return acc + paidInDraw;
    }, 0);

    const charityImpact = activeSubs * (499 * 0.1); // Estimated 10% min contribution

    res.json({
      metrics: [
        { label: "Total Subscribers", value: totalUsers, growth: "+12%" },
        { label: "Active Revenue", value: `₹${activeSubs * 499}`, growth: "+5%" },
        { label: "Prizes Distributed", value: `₹${totalPrizePaid}`, growth: "Stable" },
        { label: "Charity Impact", value: `₹${charityImpact.toFixed(0)}`, growth: "+18%" }
      ]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};