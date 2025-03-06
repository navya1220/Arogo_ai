import Appointment from "../models/appointmentModel.js";

export const createAppointment = async (req, res) => {
  try {
    const { doctorName, specialty, date, time, status, reason } = req.body;

    if (!doctorName || !specialty || !date || !time || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

   
    const newAppointment = new Appointment({
      doctorName,
      specialty,
      date,
      time,
      status,
      reason,
    });
    
    if ("email" in req.body) {
      delete req.body.email;
    }

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment created successfully",
      newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find(); 
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; 

    const updatedAppointment = await Appointment.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment updated successfully", updatedAppointment });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

