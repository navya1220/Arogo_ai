import express from "express"
import {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointments
} from "../controllers/appointmentController.js"
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router()

router.post("/", authenticateUser, createAppointment);
router.patch("/:id", updateAppointment);
router.get("/", getAppointments);

router.delete("/:id", deleteAppointment);

export default router

