import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  date: { type: String, required: true }, 
  time: { type: String, required: true }, 
  reason: { type: String, required: true },
  status: { type: String, enum: ["upcoming", "past"], default: "upcoming" },
});

const Patient = mongoose.model("Patient", patientSchema);
export default  Patient;