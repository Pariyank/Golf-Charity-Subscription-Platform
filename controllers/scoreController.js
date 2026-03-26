const User = require("../models/User");

// ADD SCORE (Requirement 05: 1-45 range, keep only latest 5)
exports.addScore = async (req, res) => {
  try {
    const { value, date } = req.body;

    // 1. Validation (Stableford Format)
    if (value < 1 || value > 45) {
      return res.status(400).json({ message: "Stableford score must be between 1 and 45" });
    }

    const user = await User.findById(req.user.id);

    // 2. Logic: Create New Score
    const newScore = { 
      value: Number(value), 
      date: date || new Date() 
    };

    // 3. FIFO Logic: If 5 scores exist, remove the oldest (index 0)
    if (user.scores.length >= 5) {
      user.scores.shift(); // Removes the oldest
    }

    // 4. Add the newest score
    user.scores.push(newScore);

    await user.save();

    res.json({
      success: true,
      scores: user.scores.slice().reverse(), // Send back most recent first
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SCORES
exports.getScores = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // PRD: Display in reverse chronological order
    const sortedScores = user.scores.slice().reverse();
    res.json({ scores: sortedScores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};