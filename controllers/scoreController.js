const User = require("../models/User");


exports.getScores = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const sortedScores = user.scores.slice().reverse();
    res.json({ scores: sortedScores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addScore = async (req, res) => {
  try {
    const { value, date } = req.body;

    if (value < 1 || value > 45) {
      return res.status(400).json({ message: "Score must be between 1 and 45" });
    }

    const user = await User.findById(req.user.id);

    user.scores.push({ value: Number(value), date: date || new Date() });

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

exports.deleteScore = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const scoreId = req.params.id;

    user.scores = user.scores.filter((s) => s._id.toString() !== scoreId);
    
    await user.save();
    res.json({ success: true, scores: user.scores.slice().reverse() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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