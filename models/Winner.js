const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema({
   userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    drawId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Draw",
        required: true
    },
    matchedCount: {
        type: Number,
        enum: [3, 4, 5],
        required: true
    },
    amountWon: {
        type: Number,
        default: 0
    },
    proofImage: {
        type: String,
        default: ""
    },
    proofStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    payoutStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending"
    }
});

module.exports = mongoose.model("Winner", winnerSchema);