const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    role: {
        type : String,
        enum : ["admin", "user"],
        default : "user"
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    charityPercentage: {
        type: Number,
        default: 0
    },
    charity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Charity"
    },
    
    scores: [{
        value: {
            type: Number,
            min: 1,
            max  : 45
        },
        date: {
            type: Date,
            default : Date.now
        }
    }],
    subscriptionPlan: {
        type: String,
        enum: ["monthly", "quarterly", "yearly", ""],
        default: ""
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", userSchema);