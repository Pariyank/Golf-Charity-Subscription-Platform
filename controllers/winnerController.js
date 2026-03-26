const Draw = require("../models/Draw");

// 📤 Upload Proof
exports.uploadProof = async (req, res) => {
  try {
    const { drawId } = req.body;

    const draw = await Draw.findById(drawId);

    const result = draw.results.find(
      r => r.user.toString() === req.user.id
    );

    if (!result) {
      return res.status(400).json({ message: "Not a winner" });
    }

    result.proofImage = req.file.path;
    result.verificationStatus = "pending";

    await draw.save();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧑‍💼 Admin Verify
exports.verifyWinner = async (req, res) => {
  try {
    const { drawId, userId, status } = req.body;

    const draw = await Draw.findById(drawId);

    const result = draw.results.find(
      r => r.user.toString() === userId
    );

    result.verificationStatus = status;

    await draw.save();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 💰 Mark Paid
exports.markPaid = async (req, res) => {
  const { drawId, userId } = req.body;

  const draw = await Draw.findById(drawId);

  const result = draw.results.find(
    r => r.user.toString() === userId
  );

  result.paymentStatus = "paid";

  await draw.save();

  res.json({ success: true });
};