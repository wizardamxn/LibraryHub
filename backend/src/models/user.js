const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { ref } = require("process");


const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    {
      _id: this._id
    }
    ,
    process.env.JWT_SECRET
    ,
    {
      expiresIn: "1h"
    }
  )
}

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}


module.exports = mongoose.model("User", userSchema);