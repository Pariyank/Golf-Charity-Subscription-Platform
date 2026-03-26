const User = require("../models/User");

exports.addScore = async (req, res) => {
  try {
    const { value, date } = req.body;

    if (value < 1 || value > 45) {
      return res.status(400).json({ message: "Stableford score must be 1-45" });
    }

    const user = await User.findById(req.user.id);
    
    // Logic: Add new score
    const newScore = { value, date: date || new Date() };
    
    // PRD: Only the latest 5 scores are retained.
    // New score replaces the oldest automatically.
    let updatedScores = [...user.scores, newScore];
    
    // Sort by date to ensure we know which is oldest
    updatedScores.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Keep only the 5 most recent
    if (updatedScores.length > 5) {
      updatedScores = updatedScores.slice(0, 5);
    }

    user.scores = updatedScores;
    await user.save();

    res.json({ success: true, scores: user.scores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};