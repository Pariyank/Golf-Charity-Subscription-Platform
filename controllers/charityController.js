const Charity = require("../models/Charity");
const User = require("../models/User");

// 1. GET ALL CHARITIES (Requirement 08: Search & Filter)
exports.getCharities = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (category && category !== "" && category !== "All") {
      query.category = category;
    }

    const charities = await Charity.find(query).sort({ featured: -1, name: 1 });
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. GET FEATURED (Requirement 08: Spotlight section)
exports.getFeatured = async (req, res) => {
  try {
    const charity = await Charity.findOne({ featured: true });
    if (!charity) {
      // Fallback to the first charity if none are marked as featured
      const fallback = await Charity.findOne();
      return res.json(fallback);
    }
    res.json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. SELECT/UPDATE CHARITY IMPACT (Requirement 08: 10% Minimum)
exports.selectCharity = async (req, res) => {
  try {
    const { charityId, contribution } = req.body;

    // PRD Check: Minimum 10% contribution required
    if (contribution < 10) {
      return res.status(400).json({ message: "Minimum 10% contribution required." });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        selectedCharity: charityId,
        charityContribution: contribution
      },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. CHARITY STATS (Requirement 11: Admin Reports)
exports.charityStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: "$selectedCharity",
          totalContribution: { $sum: "$charityContribution" },
          userCount: { $sum: 1 }
        },
      },
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};