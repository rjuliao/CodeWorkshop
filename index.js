const express = require("express");
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

const doctorsRouter = require("./doctors/doctors");
const patientRoutes = require("./patient/patient");

app.use("/doctors", doctorsRouter);
app.use(patientRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
