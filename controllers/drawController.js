const Draw = require("../models/Draw");
const User = require("../models/User");
const { sendWinnerEmail } = require('../utils/emailService');

// Helper: Calculate 40/35/25 split
const calculatePrizes = (totalPool, winnersCount) => {
  const distribution = {
    fiveMatch: totalPool * 0.40,
    fourMatch: totalPool * 0.35,
    threeMatch: totalPool * 0.25
  };

  return {
    prizePerFive: winnersCount.five > 0 ? distribution.fiveMatch / winnersCount.five : 0,
    prizePerFour: winnersCount.four > 0 ? distribution.fourMatch / winnersCount.four : 0,
    prizePerThree: winnersCount.three > 0 ? distribution.threeMatch / winnersCount.three : 0,
    rollover: winnersCount.five === 0 ? distribution.fiveMatch : 0
  };
};

exports.runDraw = async (req, res) => {
  try {
    const { type, isSimulation } = req.body; // PRD: Support simulation mode
    
    // 1. Generate Numbers (Standard or Algorithmic)
    let winningNumbers = [];
    if (type === "algorithm") {
      const allScores = await User.aggregate([{ $unwind: "$scores" }, { $group: { _id: "$scores.value", count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
      winningNumbers = allScores.slice(0, 5).map(s => s._id);
    } else {
      while (winningNumbers.length < 5) {
        let r = Math.floor(Math.random() * 45) + 1;
        if (!winningNumbers.includes(r)) winningNumbers.push(r);
      }
    }

    // 2. Identify Winners
    const activeSubscribers = await User.find({ subscriptionStatus: "active" }).populate('scores');
    const poolAmount = activeSubscribers.length * 499; // Simple math for now based on monthly
    
    let tiers = { five: [], four: [], three: [] };

    activeSubscribers.forEach(user => {
      const userNums = user.scores.map(s => s.value);
      const matches = userNums.filter(n => winningNumbers.includes(n)).length;
      
      if (matches === 5) tiers.five.push(user);
      else if (matches === 4) tiers.four.push(user);
      else if (matches === 3) tiers.three.push(user);
    });

    const prizeData = calculatePrizes(poolAmount, {
      five: tiers.five.length,
      four: tiers.four.length,
      three: tiers.three.length
    });

    if (!isSimulation) {
  for (const result of results) {
    const winner = await User.findById(result.user);
    if (winner) {
      await sendWinnerEmail(winner, result.prize, newDraw.month);
    }
  }
}

    // 3. Save Official Draw
    const results = [];
    ['five', 'four', 'three'].forEach(tier => {
      const prizeAttr = tier === 'five' ? 'prizePerFive' : tier === 'four' ? 'prizePerFour' : 'prizePerThree';
      tiers[tier].forEach(u => {
        results.push({
          user: u._id,
          matchCount: tier === 'five' ? 5 : tier === 'four' ? 4 : 3,
          prize: prizeData[prizeAttr]
        });
      });
    });

    const lastDraw = await Draw.findOne().sort({ createdAt: -1 });
    const carryOver = lastDraw ? lastDraw.jackpot : 0;

    const newDraw = await Draw.create({
      numbers: winningNumbers,
      month: new Date().toLocaleString('default', { month: 'long' }),
      year: new Date().getFullYear(),
      results,
      jackpot: prizeData.rollover + carryOver, // PRD Requirement 07: Rollover
      totalPool: poolAmount
    });

    res.status(201).json(newDraw);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};