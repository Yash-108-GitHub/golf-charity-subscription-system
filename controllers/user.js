const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Charity = require("../models/Charity")

module.exports.renderSignupForm = (req, res) =>{
    res.render("users/signup");
}

module.exports.signup = async (req, res) =>{
    try{
        const {username, email, password} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password : hashedPassword
        });

        await newUser.save();
        console.log(newUser);

        res
         .status(201)
         .json({message: "User registered successfully"});

    }catch(err){
        res.status(500).json({
            message: "server error",
            error: err.message
        });
    }
}

module.exports.renderLoginForm = (req, res) =>{
    res.render("users/login");
}

module.exports.login = async (req, res) =>{
    let {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"});
        }

        const token = jwt.sign(
            { id: user._id, 
              role: user.role
            },
            process.env.JWT_SECRET
        );

        // ✅ THIS SHOULD BE HERE
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    }catch (err) {
        // ❌ only error response here
        res.status(500).json({
            message: "server error",
            error: err.message
        });
    }
};

module.exports.renderResultPage = (req, res) =>{
    res.render("cards/results");
}

module.exports.renderAddScoreForm = (req, res) =>{
    res.render("cards/addScore");
}

module.exports.addScore = async (req, res) => {
    try {
        const { value, date } = req.body;

        if (!value) {
            return res.status(400).json({ message: "Score is required" });
        }

        if (value < 1 || value > 45) {
            return res.status(400).json({ message: "Score must be between 1 and 45" });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newScore = {
            value,
            date: date || Date.now()
        };

        user.scores.push(newScore);

        user.scores.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (user.scores.length > 5) {
            user.scores.shift();
        }

        await user.save();

        const latestScores = [...user.scores].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        res.status(200).json({
            message: "Score added successfully",
            scores: latestScores
        });
    } catch (err) {
        res.status(500).json({
            message: "server error",
            error: err.message
        });
    }
};

module.exports.renderSubscribePage = (req, res) =>{
    res.render("cards/subscription");
}

module.exports.subscribe = async (req, res) => {
    console.log("SUBSCRIBE REQUEST:", req.body);
    try {
        // req.user comes from authMiddleware
        const userId = req.user.id;

        const { plan } = req.body;

        // validation
        if (!plan) {
            return res.status(400).json({
                message: "Subscription plan is required"
            });
        }

        if (!["monthly", "quarterly", "yearly"].includes(plan)) {
            return res.status(400).json({
                message: "Invalid plan"
            });
        }

        // find user using JWT id
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // update
        user.isSubscribed = true;
        user.subscriptionPlan = plan;

        await user.save();
        console.log("SUBSCRIPTION SUCCESS:", user);

        res.status(200).json({
            message: "Subscription activated successfully",
            user: {
                id: user._id,
                isSubscribed: user.isSubscribed,
                subscriptionPlan: user.subscriptionPlan
            }
        });

    } catch (err) {
        console.log("SUBSCRIBE ERROR:", err);
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

module.exports.renderUpdateCharityForm = async (req, res) => {
  try {
    const charities = await Charity.find({});
    console.log("charities from db:", charities);

    res.render("cards/charity", {
      user: null,
      charities
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

module.exports.updateCharity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { charity, charityPercentage } = req.body;

    if (!charity || !charityPercentage) {
      return res.status(400).json({
        message: "Charity and contribution percentage are required"
      });
    }

    const charityDoc = await Charity.findOne({ name: charity });

    if (!charityDoc) {
      return res.status(404).json({
        message: "Selected charity not found"
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        charity: charityDoc._id,
        charityPercentage: Number(charityPercentage)
      },
      { new: true }
    ).populate("charity");

    return res.status(200).json({
      message: "Charity updated successfully",
      user
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};


module.exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("charity");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};
