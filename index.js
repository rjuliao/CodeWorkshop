const express = require("express");
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

const doctorsRouter = require("./doctors/doctors");
const patientRoutes = require("./patients/patient");
const appointmentsRouter = require("./doctors/appointments");

app.use("/doctors", doctorsRouter);
app.use(patientRoutes);
app.use(appointmentsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
