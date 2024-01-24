const socket = io();

// Escuchar eventos del servidor //
socket.on("productos", renderProductos);

// Función para renderizar la tabla de productos //
function renderProductos(productos) {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";

    const flexContainer = document.createElement("div");
    flexContainer.classList.add("flex-container");

    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        const contenidoTarjeta = document.createElement("div");
        contenidoTarjeta.classList.add("contenido-tarjeta");

        contenidoTarjeta.innerHTML = `
            <p>Id ${item.id} </p>
            <p>Titulo ${item.title} </p>
            <p>Precio ${item.price} </p>
            <button> Eliminar Producto </button>
        `;

        card.appendChild(contenidoTarjeta);
        flexContainer.appendChild(card);

        // Agregamos el evento eliminar producto //
        card.querySelector("button").addEventListener("click", () => {
            confirmarEliminarProducto(item.id);
        });
    });

    // Agregamos el contenedor flexible al contenedor principal //
    contenedorProductos.appendChild(flexContainer);
}

// Confirmar antes de eliminar un producto //
function confirmarEliminarProducto(id) {
    const confirmacion = confirm("¿Estás seguro de eliminar este producto?");
    if (confirmacion) {
        eliminarProducto(id);
    }
}

// Eliminar producto //
function eliminarProducto(id) {
    socket.emit("eliminarProducto", id);
}

// Evento click para agregar producto // 
document.getElementById("btnEnviar").addEventListener("click", agregarProducto);

// Función para agregar un nuevo producto //
function agregarProducto() {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true"
    };

    // Validaciones adicionales si es necesario //

    socket.emit("agregarProducto", producto);
}
