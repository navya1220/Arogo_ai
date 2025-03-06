import Patient from "../models/patientModel.js"

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Patient.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Patient.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { patientName, age, date, time, reason, status } = req.body;
    const newAppointment = new Patient({ patientName, age, date, time, reason, status });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAppointment) return res.status(404).json({ error: "Appointment not found" });
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedAppointment) return res.status(404).json({ error: "Appointment not found" });
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};