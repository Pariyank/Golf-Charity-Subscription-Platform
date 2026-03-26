const Draw = require("../models/Draw");
const User = require("../models/User");

// 1. UPLOAD PROOF (Requirement 09)
exports.uploadProof = async (req, res) => {
  try {
    const { drawId } = req.body;
    if (!req.file) return res.status(400).json({ message: "Proof image is required." });

    const draw = await Draw.findById(drawId);
    const result = draw.results.find(r => r.user.toString() === req.user.id);

    if (!result) return res.status(403).json({ message: "No winning record found for this user." });

    result.proofImage = req.file.path; // Cloudinary URL
    result.verificationStatus = "pending";

    await draw.save();
    res.json({ success: true, message: "Proof submitted for review." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. ADMIN VERIFY (Requirement 11)
exports.verifyWinner = async (req, res) => {
  try {
    const { drawId, userId, status } = req.body; // status: 'approved' or 'rejected'

    const draw = await Draw.findById(drawId);
    const result = draw.results.find(r => r.user.toString() === userId);

    if (!result) return res.status(404).json({ message: "Result not found." });

    result.verificationStatus = status;
    
    // If approved, set payment to pending
    if (status === "approved") {
        result.paymentStatus = "pending";
    }

    await draw.save();
    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. MARK PAID (Requirement 09: Pending -> Paid)
exports.markPaid = async (req, res) => {
  try {
    const { drawId, userId } = req.body;
    const draw = await Draw.findById(drawId);
    const result = draw.results.find(r => r.user.toString() === userId);

    result.paymentStatus = "paid";
    await draw.save();

    res.json({ success: true, message: "Payout confirmed." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};