const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const mongoose = require("mongoose");
const { sendEmail } = require("../utils/sendEmail");

// Send Connection Request API - POST /sendConnectionRequest - send a connection request to another user
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // Check if status is valid ("interested" or "ignored")
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      // Check if the user is trying to send request to someone who does not exist
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      // Check if a connection request already exists between the two users
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      // Create a new connection request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      // Sending email to each user once he is interested or ignored
      // ✅ Send an email when request is sent
      await sendEmail(
        "harshbansallovesv143@gmail.com",
        "New Connection Request - LinkChat",
        `<h2>New Connection Request</h2>
         <p>${req.user.firstName} has shown ${status} in connecting with ${toUser.firstName}.</p>
         <p>Visit LinkChat to view more details.</p>`,
        `${req.user.firstName} has shown ${status} in connecting with ${toUser.firstName}.`
      );

      res.json({
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      console.error("❌ Error in request/send:", err);
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

// Review Connection Request API - POST /reviewConnectionRequest - review a connection request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      // Check if status is valid ("accepted" or "rejected")
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed!" });
      }

      // Check if the status is interested and toUserId is same as loggedInUser._id
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId, //A small _id is replaced by fromUserId Error Occured
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
