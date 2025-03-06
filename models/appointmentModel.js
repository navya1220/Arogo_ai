import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  doctorName: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["upcoming", "past", "canceled"],
    default: "upcoming",
  },
  reason: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Appointments", appointmentSchema);
