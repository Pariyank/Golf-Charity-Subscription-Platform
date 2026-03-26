const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 1. REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ token: generateToken(user), role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ token: generateToken(user), role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. FIREBASE/GOOGLE LOGIN
exports.firebaseLogin = async (req, res) => {
  try {
    const { name, email, avatar, firebaseUID } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ 
        name, 
        email, 
        avatar, 
        firebaseUID, 
        role: "subscriber" 
      });
    }

    res.json({ token: generateToken(user), role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. GET CURRENT USER (REQUIRED FOR NAVBAR & DASHBOARD)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate("selectedCharity");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};