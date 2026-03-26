const User = require("../models/User");

// 1. GET ALL SCORES (Requirement 05: Latest first)
exports.getScores = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // Return scores in reverse order (most recent first)
    const sortedScores = user.scores.slice().reverse();
    res.json({ scores: sortedScores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. ADD SCORE (Requirement 05: 1-45 range, keep only latest 5)
exports.addScore = async (req, res) => {
  try {
    const { value, date } = req.body;

    if (value < 1 || value > 45) {
      return res.status(400).json({ message: "Score must be between 1 and 45" });
    }

    const user = await User.findById(req.user.id);

    // FIFO Logic: Add to the end, then check length
    user.scores.push({ value: Number(value), date: date || new Date() });

    // If more than 5, remove the oldest (first in array)
    if (user.scores.length > 5) {
      user.scores.shift();
    }

    await user.save();

    res.json({
      success: true,
      scores: user.scores.slice().reverse(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. DELETE SCORE (Fixes the "argument handler must be a function" error)
exports.deleteScore = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const scoreId = req.params.id;

    // Filter out the score with the matching ID
    user.scores = user.scores.filter((s) => s._id.toString() !== scoreId);
    
    await user.save();
    res.json({ success: true, scores: user.scores.slice().reverse() });
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

    res.json({ success: true, scores: user.scores.slice().reverse() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};