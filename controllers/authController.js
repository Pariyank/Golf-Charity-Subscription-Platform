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

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword, role: "subscriber" });
    
    console.log("✅ New User Registered:", email);
    res.status(201).json({ token: generateToken(user), role: user.role });
  } catch (err) {
    console.error("Reg Error:", err.message);
    res.status(500).json({ message: "Registration Failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    console.log("✅ User Logged In:", email);
    res.json({ token: generateToken(user), role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Login Failed" });
  }
};

exports.firebaseLogin = async (req, res) => {
  try {
    const { name, email, avatar, firebaseUID } = req.body;
    let user = await User.findOne({ email });

    const adminEmails = ["sikarwarpariyank@gmail.com"]; 
    const roleToAssign = adminEmails.includes(email) ? "admin" : "subscriber";

    if (!user) {
      user = await User.create({ name, email, avatar, firebaseUID, role: roleToAssign });
    } else {
      user.avatar = avatar;
      user.role = roleToAssign;
      await user.save();
    }

    console.log("✅ Google Auth Success:", email);
    res.json({ token: generateToken(user), role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Google Auth Sync failed" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate("selectedCharity");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};