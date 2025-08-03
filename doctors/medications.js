const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const medicalFormPath = path.join(__dirname, "../data/medical_form.json");
const medicationsPath = path.join(__dirname, "../data/medications.json");
const doctorsPath = path.join(__dirname, "../data/doctors.json");
const patientsPath = path.join(__dirname, "../data/patients.json");

// Helper to read JSON files
function readJson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Helper to write JSON files
function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Generate unique medical form id
function generateMedicalFormId(forms) {
  const lastId = forms.length
    ? Math.max(...forms.map((f) => parseInt(f.id.replace("mf", ""))))
    : 0;
  return `mf${lastId + 1}`;
}

// Endpoint: add new medical form
router.post("/medical_form", (req, res) => {
  const { patient_id, doctor_id, medicines } = req.body || {};

  if (
    !patient_id ||
    !doctor_id ||
    !Array.isArray(medicines) ||
    medicines.length === 0
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Validate patient exists
  const patients = readJson(patientsPath);
  const patient = patients.find((p) => p.id === patient_id);
  if (!patient) {
    return res.status(404).json({ error: "Patient not found." });
  }

  // Validate doctor exists
  const doctors = readJson(doctorsPath);
  const doctor = doctors.find((d) => d.id === doctor_id);
  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found." });
  }

  // Validate medicines exist
  const medications = readJson(medicationsPath);
  const validMedicines = medicines.filter((medId) =>
    medications.find((m) => m.id === medId)
  );
  if (validMedicines.length !== medicines.length) {
    return res
      .status(400)
      .json({ error: "One or more medicines do not exist." });
  }

  // Prepare medicines info
  const medicinesInfo = validMedicines.map((medId) => {
    const med = medications.find((m) => m.id === medId);
    return { id: med.id, nombre: med.nombre };
  });

  // Create new medical form
  const forms = readJson(medicalFormPath);
  const id = generateMedicalFormId(forms);

  const newForm = {
    id,
    patient_id,
    doctor_id,
    doctor_name: doctor.name,
    medicines: medicinesInfo,
  };

  forms.push(newForm);
  writeJson(medicalFormPath, forms);

  return res
    .status(201)
    .json({ message: "Medical form created successfully.", id });
});

// Endpoint: get all medications
router.get("/medications", (req, res) => {
  const medicationsPath = path.join(__dirname, "../data/medications.json");
  if (!fs.existsSync(medicationsPath)) {
    return res
      .status(404)
      .json({ error: "No se encontró el archivo de medicamentos." });
  }
  try {
    const data = fs.readFileSync(medicationsPath, "utf8");
    const medications = data ? JSON.parse(data) : [];
    return res.json(medications);
  } catch (err) {
    return res.status(500).json({ error: "Error al leer los medicamentos." });
  }
});

module.exports = router;
