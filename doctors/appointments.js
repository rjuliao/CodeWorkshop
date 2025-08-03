const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const appointmentsPath = path.join(__dirname, "../data/appointments.json");
const doctorsPath = path.join(__dirname, "../data/doctors.json");
const patientsPath = path.join(__dirname, "../data/patients.json");
const doctorsInfoPath = path.join(__dirname, "../data/doctors_info.json");

// Helper functions
function readJson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
}

function generateAppointmentId(appointments) {
  const lastId = appointments.length
    ? Math.max(...appointments.map((a) => parseInt(a.id.replace("a", ""))))
    : 0;
  return `a${lastId + 1}`;
}

// Endpoint: createAppointment
router.post("/appointments", (req, res) => {
  const {
    scheduled_date,
    scheduled_time,
    doctor_id,
    patient_id,
    patient_email,
  } = req.body || {};

  if (
    !scheduled_date ||
    !scheduled_time ||
    !doctor_id ||
    !patient_id ||
    !patient_email
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Validate doctor exists
  const doctors = readJson(doctorsPath);
  const doctor = doctors.find((d) => d.id === doctor_id);
  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found." });
  }

  // Validate patient exists
  const patients = readJson(patientsPath);
  const patient = patients.find(
    (p) => p.id === patient_id && p.email === patient_email
  );
  if (!patient) {
    return res.status(404).json({ error: "Patient not found." });
  }

  // Validate scheduled_time format (HH:MM - HH:MM)
  const timeRegex = /^([01]\d|2[0-3]):[0-5]\d\s-\s([01]\d|2[0-3]):[0-5]\d$/;
  if (!timeRegex.test(scheduled_time)) {
    return res.status(400).json({ error: "Invalid scheduled_time format." });
  }

  // Create new appointment
  const appointments = readJson(appointmentsPath);

  // Validation: prevent duplicate appointment for same doctor, patient, date, and time
  const duplicate = appointments.find(
    (a) =>
      a.doctor_id === doctor_id &&
      a.patient_id === patient_id &&
      a.scheduled_date === scheduled_date &&
      a.scheduled_time === scheduled_time
  );
  if (duplicate) {
    return res.status(409).json({
      error:
        "Appointment already exists for this doctor, patient, date, and time.",
    });
  }

  // Validation: prevent two different users from booking the same doctor, date, and time
  const slotTaken = appointments.find(
    (a) =>
      a.doctor_id === doctor_id &&
      a.scheduled_date === scheduled_date &&
      a.scheduled_time === scheduled_time
  );
  if (slotTaken) {
    return res.status(409).json({
      error: "This appointment slot is already taken by another user.",
    });
  }

  const id = generateAppointmentId(appointments);

  appointments.push({
    id,
    doctor_id,
    scheduled_date,
    scheduled_time,
    patient_id,
    patient_email,
  });

  fs.writeFileSync(appointmentsPath, JSON.stringify(appointments, null, 2));
  return res
    .status(201)
    .json({ message: "Appointment created successfully.", id });
});

// Endpoint: deleteAppointment
router.delete("/appointments/:id", (req, res) => {
  const appointmentId = req.params.id;
  const appointments = readJson(appointmentsPath);

  const index = appointments.findIndex((a) => a.id === appointmentId);
  if (index === -1) {
    return res.status(404).json({ error: "Appointment not found." });
  }

  appointments.splice(index, 1);
  fs.writeFileSync(appointmentsPath, JSON.stringify(appointments, null, 2));
  return res.status(200).json({ message: "Appointment deleted successfully." });
});

// Endpoint: rescheduleAppointment
router.put("/appointments/:id/reschedule", (req, res) => {
  const appointmentId = req.params.id;
  const { new_date, new_time, patient_id, doctor_id } = req.body || {};

  if (!new_date || !new_time || !patient_id || !doctor_id) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Read data
  const appointments = readJson(appointmentsPath);
  const patients = readJson(patientsPath);

  // Validate patient exists
  const patient = patients.find((p) => p.id === patient_id);
  if (!patient) {
    return res.status(404).json({ error: "Patient not found." });
  }

  // Find appointment
  const appointmentIndex = appointments.findIndex(
    (a) => a.id === appointmentId
  );
  if (appointmentIndex === -1) {
    return res.status(404).json({ error: "Appointment not found." });
  }

  // Validation: don't schedule on weekends
  // new_date format: DD/MM/YYYY
  const [day, month, year] = new_date.split("/");
  const dateObj = new Date(`${year}-${month}-${day}`);
  const jsDay = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
  if (jsDay === 0 || jsDay === 6) {
    return res
      .status(400)
      .json({ error: "Cannot schedule appointments on weekends." });
  }

  // Validate doctor doesn't have another appointment at the new date and time
  const conflict = appointments.find(
    (a) =>
      a.doctor_id === doctor_id &&
      a.scheduled_date === new_date &&
      a.scheduled_time === new_time &&
      a.id !== appointmentId
  );
  if (conflict) {
    return res.status(409).json({
      error:
        "Doctor already has an appointment at the requested date and time.",
    });
  }

  // Update appointment
  appointments[appointmentIndex].scheduled_date = new_date;
  appointments[appointmentIndex].scheduled_time = new_time;

  fs.writeFileSync(appointmentsPath, JSON.stringify(appointments, null, 2));
  return res
    .status(200)
    .json({ message: "Appointment rescheduled successfully." });
});

module.exports = router;
