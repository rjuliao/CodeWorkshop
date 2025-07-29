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

module.exports = router;
