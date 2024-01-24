const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const PUERTO = 8080;

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

// Middleware //
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

// Handlebars //
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Routes //
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Server //
const server = app.listen(PUERTO, () => {
  console.log(`Servidor en el Puerto ${PUERTO}`);
});

// Product Manager //
const ProductManager = require("./controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");

// Socket.IO // 
const io = socket(server);

io.on("connection", async (socket) => {
  console.log("Cliente en linea");

 // Envía el array de productos al cliente que se conectó //
  socket.emit("productos", await productManager.getProducts());

 // Maneja el evento "eliminarProducto" desde el cliente //
  socket.on("eliminarProducto", async (id) => {
    try {
      await productManager.deleteProduct(id);
      io.sockets.emit("productos", await productManager.getProducts());
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  });

// Maneja el evento "agregarProducto" desde el cliente //
  socket.on("agregarProducto", async (producto) => {
    try {
      await productManager.addProduct(producto);
      io.sockets.emit("productos", await productManager.getProducts());
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  });
});
