import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  experience: { type: Number, required: true },
  location: { type: String, required: true },
  bio: { type: String, required: true },
  education: { type: String, required: true },
  image: { type: String, required: true },
  availableSlots: [
    {
      date: { type: String, required: true },
      time: { type: String, required: true },
    },
  ],
});

const Doctor = mongoose.model("Doctor", DoctorSchema);
export default Doctor;
