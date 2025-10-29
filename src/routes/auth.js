const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Signup API - POST /signup - signup a new user and store it in database
authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added Successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

// Login API - POST /login - login a user and return a token
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Find the user by emailId
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    // Validate the password
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Get the JWT token from the user.js
      const token = await user.getJWT();

      // Add the token to the cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 9000000),
      });

      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error logging in:" + err.message);
  }
});

// Logout API - POST /logout -  Deletes the token from the cookie and logs out the user
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(0) });
  res.send("Logged out successfully");
});

module.exports = authRouter;
