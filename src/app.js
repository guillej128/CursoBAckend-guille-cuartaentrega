// Importaciones
const express = require("express");
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const MessageModel = require("./dao/models/message.model.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const { connect } = require("./database.js");

// Configuración del servidor
const app = express();
const PORT = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

// Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/", viewsRouter);

// Creación del servidor
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el Puerto ${PORT}`);
    connect(); // Conexión a la base de datos
});

// Socket.io
const io = new socket.Server(httpServer);

// Manejo de conexión de socket
io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    // Manejo de mensajes
    socket.on("message", async (data) => {
        try {
            await MessageModel.create(data);
            const messages = await MessageModel.find();
            io.sockets.emit("message", messages);
        } catch (error) {
            console.error("Error al procesar el mensaje:", error);
        }
    });
});
