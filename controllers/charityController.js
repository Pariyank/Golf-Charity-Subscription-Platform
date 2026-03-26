const Charity = require("../models/Charity");
const User = require("../models/User");

exports.getCharities = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (category && category !== "") {
      query.category = category;
    }

    const charities = await Charity.find(query).sort({ featured: -1, name: 1 });
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.selectCharity = async (req, res) => {
  try {
    const { charityId, contribution } = req.body;

    // PRD Requirement: Minimum 10%
    if (contribution < 10) {
      return res.status(400).json({ message: "Minimum 10% contribution required." });
    }

    await User.findByIdAndUpdate(req.user.id, {
      selectedCharity: charityId,
      charityContribution: contribution
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};