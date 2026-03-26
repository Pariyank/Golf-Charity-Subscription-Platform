const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword, role: "subscriber" });
    
    console.log("SUCCESS: User registered", email);
    res.status(201).json({ token: generateToken(user), role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Registration error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Admin Bypass for meeting
    if (email === "admin@golf-impact.app" && password === "AdminPassword123!") {
       const admin = await User.findOne({ email });
       return res.json({ token: generateToken(admin), role: "admin" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ token: generateToken(user), role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
};

exports.firebaseLogin = async (req, res) => {
  try {
    const { name, email, avatar, firebaseUID } = req.body;
    let user = await User.findOne({ email });
    const isAdmin = email === "sikarwarpariyank@gmail.com";

    if (!user) {
      user = await User.create({ name, email, avatar, firebaseUID, role: isAdmin ? "admin" : "subscriber" });
    }
    res.json({ token: generateToken(user), role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Google Auth error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate("selectedCharity");
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};