import User from "../models/userModel.js"
import Doctor from "../models/doctorModel.js"
import Patient from "../models/patientModel.js"
import jwt from "jsonwebtoken"
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/emailService.js"
import crypto from "crypto"

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!["patient", "doctor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email, role }); 
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials or role mismatch" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role, 
      userId: user._id, 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params

    const user = await User.findOne({ verificationToken: token })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
      })
    }

    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

    res.json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    })
  }
}

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex")

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes

    await user.save()

    // Send email
    await sendPasswordResetEmail(user.email, resetToken)

    res.json({
      success: true,
      message: "Password reset email sent",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    })
  }
}

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      })
    }

    // Set new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.json({
      success: true,
      message: "Password reset successful",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    })
  }
}

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    let profile
    if (user.role === "doctor") {
      profile = await Doctor.findOne({ user: user._id })
    } else if (user.role === "patient") {
      profile = await Patient.findOne({ user: user._id })
    }

    res.json({
      success: true,
      data: {
        user,
        profile,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    })
  }
}

