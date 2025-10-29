const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User Schema- It defines the user model
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("Invalid Email Id: " + value);
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value))
          throw new Error("Password is not strong enough: " + value);
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Invalid Gender");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg",
      validate(value) {
        if (!validator.isURL(value))
          throw new Error("Invalid Photo URL: " + value);
      },
    },
    about: {
      type: String,
      default:
        "Hey there! I'm new here. Excited to connect, share, and explore.",
    },
    interests: {
      type: [String],
    },
  },
  { timestamps: true }
);

// Mongoose Schema method

// Generate JWT token
userSchema.methods.getJWT = async function () {
  // this keyword refers to the current user document
  const user = this;

  // JWT token generation
  const token = await jwt.sign({ _id: user._id }, "LINK@ChatApp", {
    expiresIn: "7d",
  });

  return token;
};

// The password validation method
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  // Compare the passwords
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
