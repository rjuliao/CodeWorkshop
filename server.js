const express = require("express");
const app = express();

const doctorsRouter = require("./doctors/doctors");

app.use("/doctors", doctorsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
