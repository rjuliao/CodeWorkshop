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

module.exports = router;
