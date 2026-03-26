const jwt = require("jsonwebtoken");

// Verifies if the user is logged in
exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This contains the user id and role
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
};

// Verifies if the user has the correct role (Admin)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};