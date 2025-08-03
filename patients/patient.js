const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const router = express.Router();

const dataPath = path.join(__dirname, "../data/patients.json");
const appointmentsPath = path.join(__dirname, "../data/appointments.json");
const doctorsPath = path.join(__dirname, "../data/doctors.json");

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
  const validPatients = patients.filter((p) => p.id && p.id.startsWith("p"));
  const lastId = validPatients.length
    ? Math.max(...validPatients.map((p) => parseInt(p.id.replace("p", ""))))
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

// Endpoint: get all appointments for a patient
router.get("/patients/:id/appointments", (req, res) => {
  const patientId = req.params.id;
  const appointments = readPatients(); // This should be readJson for appointments
  const allAppointments = (() => {
    if (!fs.existsSync(appointmentsPath)) return [];
    try {
      const data = fs.readFileSync(appointmentsPath, "utf8");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  })();

  const doctors = (() => {
    if (!fs.existsSync(doctorsPath)) return [];
    try {
      const data = fs.readFileSync(doctorsPath, "utf8");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  })();

  const userAppointments = allAppointments
    .filter((a) => a.patient_id === patientId)
    .map((a) => {
      const doctor = doctors.find((d) => d.id === a.doctor_id) || {};
      return {
        date: a.scheduled_date,
        time: a.scheduled_time,
        doctor_name: doctor.name || "",
        doctor_id: a.doctor_id,
        medical_field: doctor.medical_field || "",
      };
    });

  return res.json(userAppointments);
});

module.exports = router;
