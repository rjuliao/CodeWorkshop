const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://rauldelasco:5lxnModZ0sweoPud@cluster0.nqfc8uc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,
    });
    console.log("Conexión a MongoDB exitosa.");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectMongo;
