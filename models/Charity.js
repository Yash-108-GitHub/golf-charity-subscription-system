const mongoose = require("mongoose");

const charitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    totalContributions: {
        type: Number,
        default: 0
    },
})

module.exports = mongoose.model("Charity", charitySchema);