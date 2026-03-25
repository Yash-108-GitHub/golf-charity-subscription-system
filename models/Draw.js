const mongoose = require("mongoose");

const drawSchema = new mongoose.Schema({
    drawMonth: {
        type: String, // "March 2026"
        required: true
    },
    drawNumbers: [{
        type: Number,
        min: 1,
        max: 5
    }],
    prizePool: {
        type: Number,
        required: true
    },
    drawStatus: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    }
})

module.exports = mongoose.model("Draw", drawSchema);