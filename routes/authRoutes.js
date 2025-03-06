import express from "express"
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getUserProfile,
} from "../controllers/authController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/verify/:token", verifyEmail)
router.post("/forgot-password", forgotPassword)
router.put("/reset-password/:token", resetPassword)
router.get("/me", protect, getUserProfile)

export default router

