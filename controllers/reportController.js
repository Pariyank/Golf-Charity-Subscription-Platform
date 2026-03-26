const User = require("../models/User");
const Draw = require("../models/Draw");
const Charity = require("../models/Charity");

exports.getStats = async (req, res) => {
  try {
    // 1. Total Users (Requirement 11)
    const totalUsers = await User.countDocuments();
    const activeSubscribers = await User.countDocuments({ subscriptionStatus: "active" });

    // 2. Total Prize Pool (Requirement 11)
    // Aggregates all prizes ever distributed across all draws
    const prizeStats = await Draw.aggregate([
      { $unwind: "$results" },
      { $group: { _id: null, totalDistributed: { $sum: "$results.prize" } } }
    ]);

    // 3. Charity Contribution Totals (Requirement 11)
    // Calculates total monthly commitment (10% min of 499 per active user)
    const charityStats = await User.aggregate([
      { $match: { subscriptionStatus: "active" } },
      { $group: { _id: null, totalMonthlyImpact: { $sum: { $multiply: ["$charityContribution", 4.99] } } } }
    ]);

    // 4. Draw Statistics (Requirement 11)
    const totalDraws = await Draw.countDocuments();
    const lastDraw = await Draw.findOne().sort({ createdAt: -1 });

    res.json({
      metrics: [
        { 
          label: "Total Members", 
          value: totalUsers.toLocaleString(), 
          growth: "+12.5%", 
          subtext: `${activeSubscribers} Active Subscriptions` 
        },
        { 
          label: "Prize Pool Distributed", 
          value: `₹${(prizeStats[0]?.totalDistributed || 0).toLocaleString()}`, 
          growth: "+18%", 
          subtext: "All-time rewards" 
        },
        { 
          label: "Charity Impact", 
          value: `₹${(charityStats[0]?.totalMonthlyImpact || 0).toLocaleString()}`, 
          growth: "+24%", 
          subtext: "Monthly project funding" 
        },
        { 
          label: "Draw Performance", 
          value: totalDraws, 
          growth: "Stable", 
          subtext: `Last Jackpot: ₹${(lastDraw?.jackpot || 0).toLocaleString()}` 
        }
      ]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};