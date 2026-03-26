exports.firebaseLogin = async (req, res) => {
  const { name, email, avatar, firebaseUID } = req.body;
  
  let user = await User.findOne({ email });

  if (!user) {
    // New Google User
    user = await User.create({ 
      name, 
      email, 
      avatar, // Save photoURL
      firebaseUID, 
      role: "subscriber" 
    });
  } else if (!user.avatar) {
    // Update existing user with Google avatar if missing
    user.avatar = avatar;
    await user.save();
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, role: user.role });
};