const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const router = express.Router();

const dataPath = path.join(__dirname, "../data/patients.json");

// Leer pacientes desde el archivo (maneja errores de parseo)
function readPatients() {
  if (!fs.existsSync(dataPath)) return [];
  try {
    const data = fs.readFileSync(dataPath, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading patients.json:", err);
    return [];
  }
}

// Guardar pacientes en el archivo (maneja errores de escritura)
function savePatients(patients) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(patients, null, 2));
  } catch (err) {
    console.error("Error writing patients.json:", err);
  }
}

// Generar un id único tipo p1001, p1002, etc.
function generatePatientId(patients) {
  const lastId = patients.length
    ? Math.max(...patients.map((p) => parseInt(p.id.replace("p", ""))))
    : 1000;
  return `p${lastId + 1}`;
}

// Encriptar contraseña
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Validar formato de email simple
function isValidEmail(email) {
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
}

// Crear nuevo paciente
router.post("/patients", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email y contraseña son requeridos." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Formato de email inválido." });
  }
  const patients = readPatients();
  if (patients.find((p) => p.email === email)) {
    return res.status(409).json({ error: "El email ya está registrado." });
  }
  const id = generatePatientId(patients);
  const hashedPassword = hashPassword(password);
  patients.push({ id, email, password: hashedPassword });
  savePatients(patients);
  return res.status(201).json({ message: "Paciente creado exitosamente.", id });
});

// Autenticar paciente
router.post("/patients/auth", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email y contraseña son requeridos." });
  }
  const patients = readPatients();
  const patient = patients.find((p) => p.email === email);
  if (!patient) {
    return res.status(404).json({ error: "Paciente no encontrado." });
  }
  const hashedPassword = hashPassword(password);
  if (patient.password !== hashedPassword) {
    return res.status(401).json({ error: "Contraseña incorrecta." });
  }
  return res
    .status(200)
    .json({ message: "Autenticación exitosa.", id: patient.id });
});

module.exports = router;
