
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")


const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  email: { type: String, unique: true },
  password: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    default: null
  }

}, { timestamps: true });

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
      name: this.fullName
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXP
    }
  )
}

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      userId: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXP
    }
  )
}



userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.models.User || mongoose.model('User', userSchema);


module.exports = User;
