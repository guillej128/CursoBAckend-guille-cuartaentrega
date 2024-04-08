const mongoose = require("mongoose");
const configObject = require("./config/config.js");
  const { mongo_url } = configObject;

  mongoose.connect(mongo_url)
.then(()=> console.log("Conectado a la Base de Datos De la casa de repuestos"))
.catch(()=> console.log("Error al conectarse a la base de Datos de la casa de repuestos"))