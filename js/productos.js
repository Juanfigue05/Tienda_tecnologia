const filtro = localStorage.getItem("valorDiv_carta");

// Traer la información del JSON en la carpeta otros
const url = "./otros/componentes.json";
fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log("Datos guardados del div-carta:", filtro);

        // Acceder al arreglo dentro de la clave "componentes"
        const productos = data.componentes;

        // Guardar la información en el localStorage
        localStorage.setItem("productos", JSON.stringify(productos));
        console.log("Datos guardados en el localStorage:", productos);

        // Mostrar los datos en consola del JSON
        console.log("Datos del JSON:", productos);

        // Crear el contenedor de productos
        const contenedorProductos = document.getElementById("productos-container");

        // Filtrar los productos según el filtro (usando la propiedad "tipo")
        const productosFiltrados = productos.filter(producto => producto.tipo === filtro);
        console.log("Productos filtrados:", productosFiltrados);

        // Verificar si hay productos filtrados
    })
    .catch(error => console.error('Error al cargar el JSON:', error));
