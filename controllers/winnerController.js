const Draw = require("../models/Draw");
const User = require("../models/User");

exports.uploadProof = async (req, res) => {
  try {
    const { drawId } = req.body;
    if (!req.file) return res.status(400).json({ message: "Proof image is required." });

    const draw = await Draw.findById(drawId);
    const result = draw.results.find(r => r.user.toString() === req.user.id);

    if (!result) return res.status(403).json({ message: "No winning record found for this user." });

    result.proofImage = req.file.path;
    result.verificationStatus = "pending";

    await draw.save();
    res.json({ success: true, message: "Proof submitted for review." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyWinner = async (req, res) => {
  try {
    const { drawId, userId, status } = req.body; 

    const draw = await Draw.findById(drawId);
    const result = draw.results.find(r => r.user.toString() === userId);

    if (!result) return res.status(404).json({ message: "Result not found." });

    result.verificationStatus = status;

    if (status === "approved") {
        result.paymentStatus = "pending";
    }

    await draw.save();
    res.json({ success: true, status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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