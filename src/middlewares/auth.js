const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Extract the token from the cookies
    const { token } = req.cookies;
    // Check if the token exists
    if (!token) {
      return res.status(401).send("Please Login");
    }

    // Verify the token
    const decodedObj = await jwt.verify(token, "LINK@ChatApp");
    // Extract the user id from the decoded token
    const { _id } = decodedObj;

    // Find the user in the database
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error authenticating user:" + err.message);
  }
};

module.exports = { userAuth };
