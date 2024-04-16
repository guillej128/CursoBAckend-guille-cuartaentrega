const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.Controller.js");
const cartController = new CartController();
const authMiddleware = require("../middleware/authmiddleware.js");

router.use(authMiddleware);

router.post("/", (req, res) => cartController.crearCarrito(req, res));

router.get("/:cid", (req, res) => cartController.obtenerCarrito(req, res));

router.post("/:cid/product/:pid", (req, res) => cartController.agregarProductoAlCarrito(req, res));

router.delete('/:cid/product/:pid', (req, res) => cartController.eliminarProductoDelCarrito(req, res));

router.put('/:cid', (req, res) => cartController.actualizarCarrito(req, res));

router.put('/:cid/product/:pid', (req, res) => cartController.actualizarCantidadDeProducto(req, res));

router.delete('/:cid', (req, res) => cartController.vaciarCarrito(req, res));

router.post('/:cid/purchase', (req, res)=> cartController.finalizarCompra(req, res));

module.exports = router;







