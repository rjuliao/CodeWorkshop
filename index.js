const express = require("express");
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

const doctorsRouter = require("./doctors/doctors");
const patientRouter = require("./patients/patient");
const appointmentsRouter = require("./doctors/appointments");
const medicationRouter = require("./doctors/medications");

app.use("/doctors", doctorsRouter);
app.use(patientRouter);
app.use(appointmentsRouter);
app.use(medicationRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
