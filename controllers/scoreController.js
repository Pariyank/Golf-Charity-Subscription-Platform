const User = require("../models/User");

// 1. GET ALL SCORES (Requirement 05: Display latest first)
exports.getScores = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Return scores sorted by date descending
    const sortedScores = user.scores.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json({ scores: sortedScores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. ADD SCORE (Requirement 05: 1-45 range, keep only latest 5)
exports.addScore = async (req, res) => {
  try {
    const { value, date } = req.body;

    // Validation
    if (value < 1 || value > 45) {
      return res.status(400).json({ message: "Stableford score must be between 1 and 45" });
    }

    const user = await User.findById(req.user.id);

    // Create new score object
    const newScore = { value, date: date || new Date() };

    // Add new score to the array
    user.scores.push(newScore);

    // Sort by date (newest first)
    user.scores.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Keep only the 5 most recent
    if (user.scores.length > 5) {
      user.scores = user.scores.slice(0, 5);
    }

    await user.save();

    res.json({
      success: true,
      scores: user.scores,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. DELETE SCORE (Requirement 11: Admin/User can manage)
exports.deleteScore = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const scoreId = req.params.id;

    user.scores = user.scores.filter(s => s._id.toString() !== scoreId);
    await user.save();

    res.json({ success: true, scores: user.scores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. EDIT SCORE
exports.editScore = async (req, res) => {
  try {
    const { value } = req.body;
    const user = await User.findById(req.user.id);
    const scoreId = req.params.id;

    const score = user.scores.id(scoreId);
    if (score) {
      score.value = value;
      await user.save();
    }

    res.json({ success: true, scores: user.scores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};