const fs = require("fs").promises;

class ProductManager {
    static lastId = 0;

    constructor(path) {
        this.path = path;
    }

    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            const arrayProductos = await this.leerArchivo();

            if (![title, description, price, code, stock, category].every(Boolean)) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            if (arrayProductos.some(item => item.code === code)) {
                console.log("El código debe ser único");
                return;
            }

            const newProduct = {
                id: ++ProductManager.lastId,
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            };

            arrayProductos.push(newProduct);
            await this.guardarArchivo(arrayProductos);
        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const arrayProductos = await this.leerArchivo();
            return arrayProductos;
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id);

            if (!buscado) {
                console.log("Producto no Encontrado");
            } else {
                console.log("Producto encontrado.");
                return buscado;
            }
        } catch (error) {
            console.log("No se encontró el producto buscado", error);
            throw error;
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            return JSON.parse(respuesta);
        } catch (error) {
            console.log("Error al leer un archivo", error);
            throw error;
        }
    }

    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo", error);
            throw error;
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerArchivo();
            const index = arrayProductos.findIndex(item => item.id === parseInt(id, 10));

            if (index !== -1) {
                const updatedProduct = { ...arrayProductos[index], ...productoActualizado };
                arrayProductos[index] = updatedProduct;
                await this.guardarArchivo(arrayProductos);
                console.log("Producto actualizado correctamente");
            } else {
                console.log("Producto no encontrado");
            }
        } catch (error) {
            console.log("Error al actualizar el producto indicado", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos.splice(index, 1);
                await this.guardarArchivo(arrayProductos);
                console.log("Producto eliminado correctamente");
            } else {
                console.log("Producto no encontrado");
            }
        } catch (error) {
            console.log("Error al eliminar el producto indicado", error);
            throw error;
        }
    }
}

module.exports = ProductManager;
