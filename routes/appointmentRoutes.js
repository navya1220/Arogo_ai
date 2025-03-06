import express from "express"
import {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointments
} from "../controllers/appointmentController.js"

const router = express.Router()

router.post("/", createAppointment);
router.patch("/:id", updateAppointment);
router.get("/", getAppointments);

router.delete("/:id", deleteAppointment);

export default router

