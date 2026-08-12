const express = require("express");
const { registerUser, loginUser, logoutUser, changeUserPassword, getUserProfile, UpdateProfileDetails } = require("../controllers/userController.js");
const JWTHelper = require("../middleware/jwtHelper.js");
const authRouter = express.Router();
authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);
authRouter.post('/changepassword', JWTHelper, changeUserPassword);
authRouter.post('/updateprofile', JWTHelper, UpdateProfileDetails);
authRouter.get('/logout', JWTHelper, logoutUser);
authRouter.get('/userprofile', JWTHelper, getUserProfile);

module.exports = authRouter;