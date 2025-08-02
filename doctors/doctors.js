const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Function to read doctors data
const getDoctorsData = () => {
  const dataPath = path.join(__dirname, "../data/doctors.json");
  const doctorsData = fs.readFileSync(dataPath);
  return JSON.parse(doctorsData);
};

// Function to read medical fields data
const getMedicalFieldsData = () => {
  const fieldsPath = path.join(__dirname, "../data/medical_fields.json");
  const fieldsData = fs.readFileSync(fieldsPath);
  return JSON.parse(fieldsData);
};

// Function to read doctor info data
const getDoctorInfoData = () => {
  const infoPath = path.join(__dirname, "../data/doctor_info.json");
  const doctorInfoData = fs.readFileSync(infoPath);
  return JSON.parse(doctorInfoData);
};
// Endpoint to get all doctors with extended info
router.get("/", (req, res) => {
  const doctors = getDoctorsData();
  const doctorInfo = getDoctorInfoData();

  const detailedDoctors = doctors.map((doctor) => {
    const info = doctorInfo.find((info) => info.doctor_id === doctor.id);
    return { ...doctor, ...info };
  });

  res.json(detailedDoctors);
});

// Endpoint to get doctors by medical field name
router.get("/:medical_field_name", (req, res) => {
  const { medical_field_name } = req.params;
  const doctors = getDoctorsData();
  const medicalFields = getMedicalFieldsData();

  const field = medicalFields.find(
    (f) => f.name.toLowerCase() === medical_field_name.toLowerCase()
  );

  if (!field) {
    res.status(404).send("Medical field not found");
    return;
  }

  const filteredDoctors = doctors.filter(
    (doctor) => doctor.medical_field === field.id
  );

  res.json(filteredDoctors);
});

// Endpoint to get doctor's availability by doctor ID
router.get("/availability/:id", (req, res) => {
  const doctorId = req.params.id;
  const doctorInfoData = getDoctorInfoData();
  const appointmentsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/appointments.json"))
  );

  // Find doctor info
  const doctorInfo = doctorInfoData.find((info) => info.doctor_id === doctorId);
  if (!doctorInfo) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }

  // Get all appointments for this doctor
  const doctorAppointments = appointmentsData.filter(
    (appt) => appt.doctor_id === doctorId
  );

  // Build availability by weekday
  const availability = {};
  for (const [day, hours] of Object.entries(doctorInfo.schedule)) {
    if (hours === "Closed") {
      availability[day] = [];
      continue;
    }
    // Parse start and end time
    const [start, end] = hours
      .replace(/am|pm/g, "")
      .split("-")
      .map((t) => t.trim());
    // Generate hourly slots (simple example: every full hour)
    const startHour = parseInt(start.split(":")[0]);
    const endHour = parseInt(end.split(":")[0]);
    let slots = [];
    for (let h = startHour; h < endHour; h++) {
      slots.push(`${h}:00`);
    }
    // Remove slots that are already booked
    const bookedSlots = doctorAppointments
      .filter((appt) => {
        const apptDate = new Date(appt.scheduled_time);
        const apptDay = apptDate.toLocaleString("en-US", { weekday: "long" });
        return apptDay === day;
      })
      .map((appt) => {
        const apptDate = new Date(appt.scheduled_time);
        return `${apptDate.getHours()}:00`;
      });
    availability[day] = slots.filter((slot) => !bookedSlots.includes(slot));
  }

  res.json({ doctor_id: doctorId, availability });
});

// Endpoint to validate time availability for a doctor on a specific day
router.get("/availability/id=:doctorId/date=:date", (req, res) => {
  const doctorId = req.params.doctorId;
  const dateStr = req.params.date;
  // Validate date format DD-MM-YYYY
  const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
  if (!dateRegex.test(dateStr)) {
    res.status(400).json({ error: "Date must be in DD-MM-YYYY format" });
    return;
  }
  // Parse date
  const [day, month, year] = dateStr.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dateObj < today) {
    res.status(400).json({ error: "Date must be today or in the future" });
    return;
  }
  // Get weekday name
  const weekday = dateObj.toLocaleString("en-US", { weekday: "long" });
  const doctorInfoData = getDoctorInfoData();
  const appointmentsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/appointments.json"))
  );

  // Find doctor info
  const doctorInfo = doctorInfoData.find((info) => info.doctor_id === doctorId);
  console.log("Doctor Info:", doctorInfo);
  if (!doctorInfo) {
    console.log("Doctor not found for ID:", doctorId);
    res.status(404).json({ error: "Doctor not found" });
    return;
  }

  // Get schedule for the specific weekday
  const hours = doctorInfo.schedule[weekday];
  console.log(`Schedule for ${weekday}:`, hours);
  if (!hours || hours === "Closed") {
    console.log(`Doctor ${doctorId} is not available on ${weekday}`);
    res.json({ doctor_id: doctorId, date: dateStr, available_slots: [] });
    return;
  }

  // Parse start and end time
  const [start, end] = hours
    .replace(/am|pm/g, "")
    .split("-")
    .map((t) => t.trim());
  const startParts = start.split(":");
  const endParts = end.split(":");
  let startHour = parseInt(startParts[0]);
  let startMinute = startParts[1] ? parseInt(startParts[1]) : 0;
  let endHour = parseInt(endParts[0]);
  let endMinute = endParts[1] ? parseInt(endParts[1]) : 0;

  // Calculate total minutes for start and end
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  // Generate 30-minute slots
  let slots = [];
  for (let mins = startTotalMinutes; mins < endTotalMinutes; mins += 30) {
    const hour = Math.floor(mins / 60);
    const minute = mins % 60;
    const slot = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    slots.push(slot);
  }
  console.log("Generated slots:", slots);

  // Remove slots that are already booked for this doctor and date
  const doctorAppointments = appointmentsData.filter(
    (appt) => appt.doctor_id === doctorId
  );
  const bookedSlots = doctorAppointments
    .filter((appt) => {
      // Compare scheduled_date in DD/MM/YYYY format
      if (!appt.scheduled_date) return false;
      const [apptDay, apptMonth, apptYear] = appt.scheduled_date
        .split("/")
        .map(Number);
      return apptDay === day && apptMonth === month && apptYear === year;
    })
    .map((appt) => {
      // Parse scheduled_time, get start time
      const timeStr = appt.scheduled_time.split("-")[0].trim();
      let hour, minute;
      if (timeStr.includes(":")) {
        [hour, minute] = timeStr.replace(/am|pm/g, "").split(":").map(Number);
      } else {
        hour = parseInt(timeStr);
        minute = 0;
      }
      // Handle am/pm
      if (timeStr.includes("pm") && hour < 12) hour += 12;
      return `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
    });
  console.log("Booked slots:", bookedSlots);
  const availableSlots = slots.filter((slot) => !bookedSlots.includes(slot));
  console.log("Available slots:", availableSlots);

  res.json({
    doctor_id: doctorId,
    date: dateStr,
    available_slots: availableSlots,
  });
});

module.exports = router;
