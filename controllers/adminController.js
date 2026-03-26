const User = require("../models/User");
const Charity = require("../models/Charity");


exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

exports.editUserScore = async (req, res) => {
  try {
    const { userId, scoreIndex, newValue } = req.body;
    const user = await User.findById(userId);
    
    if (newValue < 1 || newValue > 45) return res.status(400).json({ message: "Invalid score" });
    
    user.scores[scoreIndex].value = newValue;
    await user.save();
    res.json({ success: true, scores: user.scores });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addCharity = async (req, res) => {
  const charity = await Charity.create(req.body);
  res.status(201).json(charity);
};

exports.deleteCharity = async (req, res) => {
  await Charity.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};