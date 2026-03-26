const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ token: generateToken(user), role: user.role });
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  res.json({ token: generateToken(user), role: user.role });
};

exports.firebaseLogin = async (req, res) => {
  const { name, email, firebaseUID } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, firebaseUID, role: "subscriber" });
  }
  res.json({ token: generateToken(user), role: user.role });
};