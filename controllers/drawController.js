const Draw = require("../models/Draw");
const User = require("../models/User");

// 1. RUN DRAW (Requirement 06: Simulation vs Official)
exports.runDraw = async (req, res) => {
  try {
    const { type, isSimulation } = req.body;
    
    // Generate Numbers
    let winningNumbers = [];
    if (type === "algorithm") {
      const allScores = await User.aggregate([
        { $unwind: "$scores" }, 
        { $group: { _id: "$scores.value", count: { $sum: 1 } } }, 
        { $sort: { count: -1 } }
      ]);
      winningNumbers = allScores.slice(0, 5).map(s => s._id);
    } else {
      while (winningNumbers.length < 5) {
        let r = Math.floor(Math.random() * 45) + 1;
        if (!winningNumbers.includes(r)) winningNumbers.push(r);
      }
    }

    const activeSubscribers = await User.find({ subscriptionStatus: "active" });
    const poolAmount = activeSubscribers.length * 499; // Base pool calculation
    
    let tiers = { five: [], four: [], three: [] };

    activeSubscribers.forEach(user => {
      const userNums = user.scores.map(s => s.value);
      const matches = userNums.filter(n => winningNumbers.includes(n)).length;
      if (matches === 5) tiers.five.push(user);
      else if (matches === 4) tiers.four.push(user);
      else if (matches === 3) tiers.three.push(user);
    });

    // Requirement 07: Prize Logic
    const prizeDist = {
      five: poolAmount * 0.40,
      four: poolAmount * 0.35,
      three: poolAmount * 0.25
    };

    const stats = {
      totalPool: poolAmount,
      winners: { five: tiers.five.length, four: tiers.four.length, three: tiers.three.length },
      prizePerTier: {
        prizePerFive: tiers.five.length > 0 ? prizeDist.five / tiers.five.length : 0,
        prizePerFour: tiers.four.length > 0 ? prizeDist.four / tiers.four.length : 0,
        prizePerThree: tiers.three.length > 0 ? prizeDist.three / tiers.three.length : 0,
        rollover: tiers.five.length === 0 ? prizeDist.five : 0
      }
    };

    if (isSimulation) return res.json({ winningNumbers, stats });

    // Official Publishing
    const results = [];
    ['five', 'four', 'three'].forEach(t => {
      const count = t === 'five' ? 5 : t === 'four' ? 4 : 3;
      const prizeKey = t === 'five' ? 'prizePerFive' : t === 'four' ? 'prizePerFour' : 'prizePerThree';
      tiers[t].forEach(u => {
        results.push({ user: u._id, matchCount: count, prize: stats.prizePerTier[prizeKey] });
      });
    });

    const lastDraw = await Draw.findOne().sort({ createdAt: -1 });
    const draw = await Draw.create({
      numbers: winningNumbers,
      month: new Date().toLocaleString('default', { month: 'long' }),
      year: new Date().getFullYear(),
      results,
      jackpot: stats.prizePerTier.rollover + (lastDraw?.jackpot || 0),
      totalPool: poolAmount
    });

    res.status(201).json(draw);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. GET ALL DRAWS (Requirement 11: Admin Management)
exports.getDraws = async (req, res) => {
  try {
    const draws = await Draw.find()
      .populate("results.user", "name email")
      .sort({ createdAt: -1 });
    res.json(draws);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. GET USER WINNINGS (Requirement 10: User Dashboard)
exports.getUserWinnings = async (req, res) => {
  try {
    const draws = await Draw.find({ "results.user": req.user.id });
    const userWinnings = draws.map(draw => {
      const result = draw.results.find(r => r.user.toString() === req.user.id);
      return {
        ...result._doc,
        drawId: draw._id,
        month: draw.month,
        numbers: draw.numbers
      };
    });
    res.json(userWinnings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};