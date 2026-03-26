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
    console.log("Attempting to register user:", email);

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("Registration failed: User exists");
      return res.status(400).json({ message: "User exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashed });
    console.log("✅ User created successfully in MongoDB:", user._id);

    res.json({ 
      token: generateToken(user), 
      role: user.role 
    });
  } catch (err) {
    console.error("❌ MongoDB Save Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 2. LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    res.json({ 
      success: true, 
      token: generateToken(user), 
      role: user.role 
    });
  } catch (err) {
    console.error("LOGIN_ERROR:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 3. FIREBASE/GOOGLE LOGIN
exports.firebaseLogin = async (req, res) => {
  try {
    const { name, email, avatar, firebaseUID } = req.body;
    let user = await User.findOne({ email });

    // Handle Admin Bypass for your email
    const adminEmails = ["sikarwarpariyank@gmail.com"]; 
    const roleToAssign = adminEmails.includes(email) ? "admin" : "subscriber";

    if (!user) {
      user = await User.create({ 
        name, 
        email, 
        avatar, 
        firebaseUID, 
        role: roleToAssign 
      });
    } else {
      // Update info if they exist
      user.avatar = avatar;
      user.role = roleToAssign;
      await user.save();
    }

    res.json({ 
      success: true, 
      token: generateToken(user), 
      role: user.role 
    });
  } catch (err) {
    console.error("GOOGLE_LOGIN_ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. GET ME
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Not authorized" });
  }
};