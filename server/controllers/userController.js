const express = require('express');
const User = require('../models/User.js');
const ApiError = require('../helper/apiError');
const ApiResponse = require('../helper/apiResponse');
const cookie = require("cookie-parser");
const { transporter, sendingMail } = require('../utils/sendMail.js');
const rateLimit = require("express-rate-limit");



const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 1,
    message: "Too many requests from this decive, please try again later",
    standardHeaders: true,
    legacyHeaders: false
})

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(401, "UnAuthorized User")
        }
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        console.log("generating tokens while errors", error)
        throw new ApiError(500, "something went wrong while generating tokens")
    }
}

const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json(
                new ApiError(401, "Unauthenticated user")
            );
        }
        const userProfile = await User
            .findById(userId)
            .select("-password");
        if (!userProfile) {
            return res.status(404).json(
                new ApiError(404, "User not found")
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                userProfile,
                "User profile fetched successfully"
            )
        );
    } catch (error) {
        console.log("getUserProfile error:", error);
        return next(error);
    }
};



const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, bio } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json(new ApiError(400, "fullName, email and password are required!"))
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(new ApiError(400, "user already exists!"))
        }

        const createdUser = await User.create({
            fullName,
            email,
            password,
            bio
        })
        if (!createdUser) {
            return res.status(500).json(new ApiError(500, "user not created!"))
        }
        const options = {
            // httpOnly: true,
            secure: true,
        }
        const userObj = createdUser.toObject();
        delete userObj.password;
        delete userObj.refreshToken;

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(createdUser._id);
        return res
            .cookie("refreshToken", refreshToken, options)
            .cookie("accessToken", accessToken, options)
            .status(201).json(new ApiResponse("user created successfully!", { accesstoken: accessToken, userData: userObj }, 201));
    } catch (error) {
        throw new ApiError("somthing happend ", 500)
    }
}

const UpdateProfileDetails = async (req, res, next) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json(
                new ApiError(
                    401,
                    "Unauthorized, login first!"
                )
            );
        }

        const { fullName, bio } = req.body;

        if (!fullName.trim() || !bio.trim()) {
            return res.status(400).json(
                new ApiError(
                    400,
                    "All fields are required!"
                )
            );
        }
        const currentUser = await User
            .findById(userId)
            .select("fullName bio");
        if (!currentUser) {
            return res.status(404).json(
                new ApiError(
                    404,
                    "User not found"
                )
            );
        }

        const sameFullName =
            currentUser.fullName?.trim().toLowerCase() ===
            fullName.trim().toLowerCase();

        const sameBio =
            currentUser.bio?.trim().toLowerCase() ===
            bio.trim().toLowerCase();

        if (sameFullName && sameBio) {
            return res.status(400).json(
                new ApiError(
                    400,
                    "New details & old details are same try new ! "
                )
            );
        }

        const updatedDetails = await User
            .findByIdAndUpdate(
                userId,
                {
                    $set: {
                        fullName,
                        bio,
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            )
            .select("-password -refreshToken");

        if (!updatedDetails) {
            return res.status(404).json(
                new ApiError(
                    404,
                    "User not found"
                )
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                updatedDetails,
                "User details updated successfully"
            )
        );
    } catch (error) {
        console.log("Update profile error:", error);
        return next(error);
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email.trim() && !password.trim()) {
            return res.status(400).json(new ApiError(400, "email and password are required!"))
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json(new ApiError(404, "user not found!"))
        }

        const isMatch = await user.isPasswordCorrect(password)
        if (!isMatch) {
            return res.status(400).json(new ApiError(400, "email and password is incorrect!"))
        }
        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)
        const options = {
            httpOnly: true,
            secure: true,
        }
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.refreshToken;
        return res
            .cookie("refreshToken", refreshToken, options)
            .cookie("accessToken", accessToken, options)
            .status(200).json(new ApiResponse("user logged in successfully!", { accesstoken: accessToken, userData: userObj }, 200));
    } catch (error) {
        console.log(error)
    }
}



const logoutUser = async (req, res, next) => {
    try {
        const user = req?.user?.userId
        if (user) {
            await User.findByIdAndUpdate(
                user,
                {
                    $set: {
                        refreshToken: undefined,
                    },
                }
            );
        }

        const cookieOptions = {
            // httpOnly: true,
            secure: true,
        };

        return res
            .clearCookie("refreshToken", cookieOptions)
            .clearCookie("accessToken", cookieOptions)
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "User logged out successfully"
                )
            );
    } catch (error) {
        console.log("Logout error:", error);
        return next(error);
    }
};



const changeUserPassword = async (req, res) => {
    let user = req.user.userId;
    console.log("userid at changepassword", user)
    try {
        if (!user) {
            throw new ApiError(401, "UnAuthorized User")
        }
        let { currentPassword, newPassword, confirmPassword } = req.body;
        console.log("cheaking current password", currentPassword)
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400)
                .json(
                    new ApiError(
                        400,
                        "All fields are required !"
                    )
                )
        }

        if (newPassword !== confirmPassword) {
            return res.status(400)
                .json(
                    new ApiError(
                        400,
                        "Your new password and confirm password are not same, please verify!"
                    )
                )
        }

        if (currentPassword.toLowerCase() === newPassword.toLowerCase()) {
            return res.status(400)
                .json(
                    new ApiError(
                        400,
                        "Password and new password are same, please try a new one!"
                    )
                )
        }

        const userPassword = await User.findById(user);

        const isMatch = await userPassword.isPasswordCorrect(currentPassword);
        console.log("debug password at userchangepassword in controller", isMatch)
        if (!isMatch) {
            return res.status(400)
                .json(
                    new ApiError(
                        400,
                        "Current password is incorrect !"
                    )
                )
        }

        const userObj = userPassword.toObject();
        delete userObj.password;
        delete userObj.refreshToken;
        userPassword.password = newPassword
        await userPassword.save({ validateBeforeSave: true })

        return res.status(200).json(new ApiResponse("Password changed successfully", {}, 200))
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Something happened while changing the password")
    }
}

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json(new ApiError(400, "email is require !"))
            return;
        }
        // console.log("email cheaking at sentotp js", email)
        const existUser = await User.findOne({ email });
        if (!existUser) {
            res.status(404).json(new ApiError(404, "User not found !"))
            return;
        }
        const generateOtp = Math.floor(100000 + Math.random() * 99999)
        existUser.otp = generateOtp;
        existUser.otpExpire = Date.now() + 5 * 60 * 1000
        await existUser.save()
        const sendEmail = await transporter.sendMail(sendingMail(email, generateOtp))
        // console.log("sendmail func cheaking at usercontroller line 341", sendEmail)
        if (!sendEmail) {
            res.status(500).
                json(new ApiError(500, "something happend while send otp"))
            return;
        }
        res.status(200).json(new ApiResponse("Otp send successfully ", sendEmail, 200))
    } catch (error) {
        console.log("error at send otp controller", error)
        throw new ApiError("somthing happend from our side")

    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;
        console.log("cheak at resetj", email)

        if (!email.trim() || !otp.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            res.status(400).json(new ApiError(400, "all fields are require !"))
            return
        }

        const exitsUser = await User.findOne({ email });
        if (!exitsUser) {
            res.status(404).json(new ApiError(404, "user not found !"))
            return
        }

        if (otp !== exitsUser.otp) {
            res.status(400).json(new ApiError(400, "Invalide OTP try again !"))
            return
        }
        if (Date.now() > exitsUser.otpExpire) {
            res.status(400).json(new ApiError(400, "OTP is expired !"))
            return
        }

        if (newPassword.toLowerCase() !== confirmPassword.toLowerCase()) {
            res.status(400).json(new ApiError(400, "new password and confirm password are not same please cheak ! !"))
            return
        }
        exitsUser.password = newPassword;
        exitsUser.otp = null;
        exitsUser.otpExpire = null;
        await exitsUser.save({ validateBeforeSave: true })
        res.status(200).json(new ApiResponse("user password changed successfully", 200))
    } catch (error) {
        console.log("errror on reset pass", error)
        throw new ApiError(500, "Something happened while changing the password")

    }
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    changeUserPassword,
    UpdateProfileDetails,
    sendOtp,
    resetPassword,
    otpLimiter
}