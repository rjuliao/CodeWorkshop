const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Function to read doctors data
const getDoctorsData = () => {
  const dataPath = path.join(__dirname, '../data/doctors.json');
  const doctorsData = fs.readFileSync(dataPath);
  return JSON.parse(doctorsData);
};

// Function to read medical fields data
const getMedicalFieldsData = () => {
  const fieldsPath = path.join(__dirname, '../data/medical_fields.json');
  const fieldsData = fs.readFileSync(fieldsPath);
  return JSON.parse(fieldsData);
};

// Endpoint to get all doctors
router.get('/', (req, res) => {
  const doctors = getDoctorsData();
  res.json(doctors);
});

// Endpoint to get doctors by medical field name
router.get('/:medical_field_name', (req, res) => {
  const { medical_field_name } = req.params;
  const doctors = getDoctorsData();
  const medicalFields = getMedicalFieldsData();

  // Find the corresponding medical field ID
  const field = medicalFields.find(
    (f) => f.name.toLowerCase() === medical_field_name.toLowerCase()
  );

  if (!field) {
    res.status(404).send('Medical field not found');
    return;
  }

  // Filter doctors by medical field ID
  const filteredDoctors = doctors.filter(
    (doctor) => doctor.medical_field === field.id
  );

  res.json(filteredDoctors);
});

module.exports = router;