const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");

// Rutas//
router.get("/", async (req, res) => {
    try {
        const arrayProductos = await productManager.leerArchivo();
        const limit = parseInt(req.query.limit);

        if (limit) {
            const arrayConLimite = arrayProductos.slice(0, limit);
            return res.json(arrayConLimite);
        } else {
            return res.json(arrayProductos);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al procesar la solicitud." });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const buscado = await productManager.getProductById(pid);

        if (buscado) {
            return res.json(buscado);
        } else {
            return res.status(404).json({ error: "ID de producto no encontrado o incorrecto." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error en la búsqueda del ID." });
    }
});

router.post("/", async (req, res) => {
    try {
        const nuevoProducto = req.body;

        const validationError = validarProducto(nuevoProducto);
        if (validationError) {
            return res.status(400).json({ error: true, message: validationError });
        }

        await productManager.addProduct(nuevoProducto);

        return res.status(201).json({ success: true, message: "Producto agregado exitosamente." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Error al intentar agregar producto." });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const productoActualizado = req.body;

        if (!pid || !productoActualizado) {
            return res.status(400).json({ error: true, message: "Parámetros incompletos. Se requiere un ID y datos para actualizar." });
        }

        await productManager.updateProduct(pid, productoActualizado);

        return res.status(200).json({ success: true, message: "Producto actualizado exitosamente." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Error al intentar actualizar el producto." });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);

        if (!pid) {
            return res.status(400).json({ error: true, message: "ID de producto no válido." });
        }

        await productManager.deleteProduct(pid);

        return res.status(200).json({ success: true, message: "Producto eliminado exitosamente." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: "Error al intentar eliminar el producto." });
    }
});

// Función de validación de productos//
function validarProducto(producto) {
    const { title, description, price, img, code, stock, status, category } = producto;

    if (!title || !description || !price || !img || !code || !stock || !status || !category) {
        return "Todos los campos son obligatorios. Intente nuevamente";
    }

    

    return null; 
}

module.exports = router;
