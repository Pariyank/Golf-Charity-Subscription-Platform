const User = require("../models/User");
const Charity = require("../models/Charity");

// USERS
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

// ADD CHARITY
exports.addCharity = async (req, res) => {
  const charity = await Charity.create(req.body);
  res.json(charity);
};

// DELETE CHARITY
exports.deleteCharity = async (req, res) => {
  await Charity.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};