const mongoose = require("mongoose");
const User = require("../models/user");
const Charity = require("../models/Charity");
const Winner = require("../models/Winner");
const Draw = require("../models/Draw");

module.exports.renderDashboard = async (req, res) => {
  try {
    res.render("dashboard");
  } catch (err) {
    console.log("renderDashboard error:", err);
    res.status(500).send("Server Error");
  }
};

module.exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("charity");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.log("getProfile error:", err);
    res.status(500).json({
      message: "Server Error",
      error: err.message
    });
  }
};

module.exports.updateCharity = async (req, res) => {
  try {
    const { charity, charityPercentage } = req.body;

    if (!charity || !charityPercentage) {
      return res.status(400).json({
        message: "Charity and charity percentage are required"
      });
    }

    const charityDoc = await Charity.findOne({ name: charity });

    if (!charityDoc) {
      return res.status(404).json({ message: "Charity not found" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        charity: charityDoc._id,
        charityPercentage: Number(charityPercentage)
      },
      { new: true }
    ).populate("charity");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Charity updated successfully",
      user
    });
  } catch (err) {
    console.log("updateCharity error:", err);
    res.status(500).json({
      message: "Server Error",
      error: err.message
    });
  }
};

module.exports.getWinnings = async (req, res) => {
  try {
    console.log("req.user.id =", req.user.id);

    const winners = await Winner.find({
      userId: new mongoose.Types.ObjectId(req.user.id)
    })
      .populate("drawId")
      .sort({ _id: -1 });

    console.log("winners =", JSON.stringify(winners, null, 2));

    const totalWins = winners.length;
    const totalAmountWon = winners.reduce((sum, w) => sum + (w.amountWon || 0), 0);
    const lastResult = winners.length > 0 ? winners[0] : null;

    let payoutStatus = "No Data";
    if (winners.length > 0) {
      payoutStatus = winners.some(w => w.payoutStatus === "pending")
        ? "Pending"
        : "Paid";
    }

    res.status(200).json({
      totalWins,
      totalAmountWon,
      payoutStatus,
      lastResult,
      winners
    });
  } catch (err) {
    console.log("getWinnings FULL ERROR =", err);
    res.status(500).json({
      message: "Server Error",
      error: err.message
    });
  }
};