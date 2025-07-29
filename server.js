// Import the required modules
const express = require("express");

// Create an Express application
const app = express();

// Define a port to listen on
const PORT = process.env.PORT || 3000;

// Ensure the express module is installed
const fs = require("fs");
const path = require("path");

// Function to read doctors data
const getDoctorsData = () => {
  const dataPath = path.join(__dirname, "data", "doctors.json");
  const doctorsData = fs.readFileSync(dataPath);
  return JSON.parse(doctorsData);
};

// Endpoint to get all doctors
//docget;
app.get("/doctors", (req, res) => {
  const doctors = getDoctorsData();
  res.json(doctors);
});

// Function to read medical fields data
const getMedicalFieldsData = () => {
  const fieldsPath = path.join(__dirname, "data", "medical_fields.json");
  const fieldsData = fs.readFileSync(fieldsPath);
  return JSON.parse(fieldsData);
};

// Endpoint to get doctors by medical field name
app.get("/doctors/:medical_field_name", (req, res) => {
  const { medical_field_name } = req.params;
  const doctors = getDoctorsData();
  const medicalFields = getMedicalFieldsData();

  // Find the corresponding medical field ID
  const field = medicalFields.find(
    (f) => f.name.toLowerCase() === medical_field_name.toLowerCase()
  );

  if (!field) {
    res.status(404).send("Medical field not found");
    return;
  }

  // Filter doctors by medical field ID
  const filteredDoctors = doctors.filter(
    (doctor) => doctor.medical_field === field.id
  );

  res.json(filteredDoctors);
}); // Endpoint to get doctors by medical field ID
app.get("/doctors/:medical_field", (req, res) => {
  const { medical_field } = req.params;
  const doctors = getDoctorsData();
  const filteredDoctors = doctors.filter(
    (doctor) => doctor.medical_field === medical_field
  );
  res.json(filteredDoctors);
});

const exec = require("child_process").exec;
exec("npm install express", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
