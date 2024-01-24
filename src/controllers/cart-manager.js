const fs = require("fs").promises;

class CartManager {
    static carts = [];

    constructor(path) {
        this.path = path;
        this.ultId = 0;
        this.cargarCarritos();
    }

    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf8");
            CartManager.carts = JSON.parse(data);
            if (CartManager.carts.length > 0) {
                this.ultId = Math.max(...CartManager.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.error("Error al cargar los carritos", error);
            await this.guardarCarritos();
            throw error; 
        }
    }

    async guardarCarritos() {
        await fs.writeFile(this.path, JSON.stringify(CartManager.carts, null, 2));
    }

    async crearCarrito() {
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        };

        CartManager.carts.push(nuevoCarrito);

        await this.guardarCarritos();
        return nuevoCarrito;
    }

    async getCarritoById(cartId) {
        try {
            const carrito = CartManager.carts.find(car => car.id === cartId);

            if (!carrito) {
                throw new Error(`No existe un carrito con el ID ${cartId} indicado`);
            }
            return carrito;
        } catch (error) {
            console.error(`Error al obtener carrito a través del ID`, error);
            throw error;
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        const carrito = await this.getCarritoById(cartId);
        const productoIndex = carrito.products.findIndex(p => p.product === productId);

        if (productoIndex >= 0) {
            carrito.products[productoIndex].quantity += quantity;
        } else {
            carrito.products.push({ product: productId, quantity });
        }

        await this.guardarCarritos();
        return carrito;
    }
}

module.exports = CartManager;
