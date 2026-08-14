const express = require("express");
const { registerUser, loginUser, logoutUser, changeUserPassword, getUserProfile, UpdateProfileDetails, sendOtp, resetPassword, limiter } = require("../controllers/userController.js");
const JWTHelper = require("../middleware/jwtHelper.js");
const authRouter = express.Router();
authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);
authRouter.post('/changepassword', JWTHelper, changeUserPassword);
authRouter.post('/updateprofile', JWTHelper, UpdateProfileDetails);
authRouter.get('/logout', JWTHelper, logoutUser);
authRouter.get('/userprofile', JWTHelper, getUserProfile);
authRouter.post('/sendotp', sendOtp);
authRouter.post('/resetpassword', resetPassword);

module.exports = authRouter;