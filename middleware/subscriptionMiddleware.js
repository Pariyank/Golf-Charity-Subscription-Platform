const User = require("../models/User");

exports.requireActiveSubscription = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (user.role === 'admin') return next(); // Admins bypass sub check

  if (user.subscriptionStatus !== "active") {
    return res.status(403).json({ 
      message: "Subscription Required", 
      redirect: "/subscribe" 
    });
  }
  next();
};