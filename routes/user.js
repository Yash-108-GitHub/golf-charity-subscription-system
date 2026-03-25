const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.js");
const { authMiddleware } = require("../middleware/authMiddleware");

router.route("/signup")
 .get(userController.renderSignupForm)
 .post(userController.signup);

router.route("/login")
 .get(userController.renderLoginForm)
 .post(userController.login);
 
router.route("/add-score")
 .get(userController.renderAddScoreForm)
 .post(authMiddleware, userController.addScore);

router.route("/subscribe")
 .get(userController.renderSubscribePage)
 .post(authMiddleware, userController.subscribe);

router.route("/update-charity")
 .get(userController.renderUpdateCharityForm)
 .put(authMiddleware, userController.updateCharity);

router.route("/result")
 .get(userController.renderResultPage);

router.route("/me")
  .get(authMiddleware, userController.getMe);

  
module.exports = router;