const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

// Profile API - GET /profile/view - get the profile of the logged in user
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching profile:" + err.message);
  }
});

// Profile API - PATCH /profile/edit - edit the profile of the logged in user
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    // Update the user
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error editing profile:" + err.message);
  }
});

module.exports = profileRouter;
