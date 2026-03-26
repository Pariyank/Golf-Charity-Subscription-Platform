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

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    res.json({ token: generateToken(user), user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    res.json({ token: generateToken(user), user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FIREBASE LOGIN
exports.firebaseLogin = async (req, res) => {
  const { name, email, firebaseUID } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ name, email, firebaseUID });
  }

  res.json({ token: generateToken(user), user });
};