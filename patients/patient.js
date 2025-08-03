const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const dataPath = path.join(__dirname, "../data/patients.json");

// Leer pacientes desde el archivo
function readPatients() {
  if (!fs.existsSync(dataPath)) return [];
  const data = fs.readFileSync(dataPath, "utf8");
  return data ? JSON.parse(data) : [];
}

// Guardar pacientes en el archivo
function savePatients(patients) {
  fs.writeFileSync(dataPath, JSON.stringify(patients, null, 2));
}

// Crear nuevo paciente
router.post("/patients", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email y contraseña son requeridos." });
  }
  const patients = readPatients();
  if (patients.find((p) => p.email === email)) {
    return res.status(409).json({ error: "El email ya está registrado." });
  }
  patients.push({ email, password });
  savePatients(patients);
  return res.status(201).json({ message: "Paciente creado exitosamente." });
});

// Autenticar paciente
router.post("/patients/auth", (req, res) => {
  const { email, password } = req.body;
  const patients = readPatients();
  const patient = patients.find((p) => p.email === email);
  if (!patient) {
    return res.status(404).json({ error: "Paciente no encontrado." });
  }
  if (patient.password !== password) {
    return res.status(401).json({ error: "Contraseña incorrecta." });
  }
  return res.status(200).json({ message: "Autenticación exitosa." });
});

module.exports = router;
