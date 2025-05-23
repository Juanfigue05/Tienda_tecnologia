document.addEventListener('DOMContentLoaded', function () {
    const filtro = localStorage.getItem("valorDiv_carta");
    console.log("Div seleccionado:", filtro);

    // Verificar si ya existen productos en el localStorage
    let productos = JSON.parse(localStorage.getItem("productos"));

    if (!productos) {
        // Si no existen productos en el localStorage, cargar desde el JSON
        const url = "./otros/componentes.json";
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar el JSON');
                }
                return response.json();
            })
            .then(data => {
                if (data && Array.isArray(data.componentes)) {
                    localStorage.setItem('productos', JSON.stringify(data.componentes));
                    console.log("Datos guardados en el localStorage:", data.componentes);
                } else {
                    console.error("Estructura de datos inválida en el JSON");
                }

                // Acceder al arreglo dentro de la clave "componentes"
                productos = data.componentes;

                // Asegurarse de que cada producto tenga un ID único
                productos.forEach((producto, index) => {
                    if (!producto.id) {
                        producto.id = index + 1;
                    }
                });

                // Mostrar productos según el filtro
                mostrarProductosConFiltro(filtro, productos);
            })
            .catch(error => console.error('Error al cargar el JSON:', error));
    } else {
        // Si ya existen productos en el localStorage, usarlos directamente
        console.log("Productos cargados desde el localStorage:", productos);
        mostrarProductosConFiltro(filtro, productos);
    }
});

function mostrarProductosConFiltro(filtro, productos) {
    if (filtro && filtro !== "") {
        // Marcar el checkbox correspondiente
        const checkboxes = document.querySelectorAll('.filtro-categoria');
        checkboxes.forEach(checkbox => {
            if (checkbox.value.toLowerCase() === filtro.toLowerCase()) {
                checkbox.checked = true; // Marcar el checkbox
            }
        });

        // Filtrar y mostrar los productos del tipo seleccionado
        console.log("Aplicando filtro automáticamente:", filtro);
        imprimir_productos([filtro]); // Llamar a la función para mostrar los productos filtrados
    } else {
        // Si no hay filtro, mostrar todos los productos
        console.log("No hay filtro, mostrando todos los productos.");
        imprimir_productos();
    }
}

// Función para imprimir todos los productos
function imprimir_productos(filtros = []) {
    const div_mostrar = document.getElementById("productos");
    const productos = JSON.parse(localStorage.getItem("productos"));
    console.log("Productos cargados desde localStorage:", productos);

    if (!Array.isArray(productos)) {
        console.error("Error: 'productos' no es un arreglo.");
        return; // Detener la ejecución si no es un arreglo
    }

    div_mostrar.innerHTML = "";

    // Recuperar los filtros desde el localStorage si no se pasan como argumento
    if (filtros.length === 0) {
        const filtrosGuardados = JSON.parse(localStorage.getItem('filtrosSeleccionados')) || [];
        filtros = filtrosGuardados;
    }

    // Filtrar productos si hay filtros activos
    let productosFiltrados = productos;
    if (filtros.length > 0) {
        productosFiltrados = productos.filter(producto => 
            filtros.some(filtro => filtro.toLowerCase() === producto.tipo.toLowerCase())
        );
    }

    // Mostrar los productos
    for (let i = 0; i < productosFiltrados.length; i++) {
        const producto = productosFiltrados[i];

        // Crear columna responsiva
        const colDiv = document.createElement('div');
        colDiv.className = "col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4";

        // Crear la tarjeta del producto
        const carta_mostrar = document.createElement('div');
        carta_mostrar.className = "card h-100 shadow-sm producto-card";

        // Crear contenedor para la imagen
        const imgContainer = document.createElement('div');
        imgContainer.className = "img-container text-center p-3";
        imgContainer.style.height = "200px";
        imgContainer.style.display = "flex";
        imgContainer.style.alignItems = "center";
        imgContainer.style.justifyContent = "center";

        // Crear la imagen
        const img = document.createElement("img");
        img.src = producto.img;
        img.className = "img-fluid";
        img.style.maxHeight = "180px";
        img.alt = producto.modelo;

        // Cuerpo de la tarjeta
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        // Crear título
        const titulo = document.createElement("h5");
        titulo.className = "card-title";
        titulo.textContent = producto.tipo + " - " + producto.marca + " - " + producto.modelo;

        // Crear descripción
        const descripcion = document.createElement("p");
        descripcion.className = "card-text small";
        descripcion.innerHTML = "Precio: " + formatearPrecio(producto.precio) + "<br>Cantidad disponible: " + producto.cantidad;

        // Disponibilidad del producto
        const disponibilidad = document.createElement("span");
        if (producto.cantidad > 0) {
            disponibilidad.textContent = "Disponible";
            disponibilidad.className = "badge bg-success";
        } else {
            disponibilidad.textContent = "Agotado";
            disponibilidad.className = "badge bg-danger";
        }

        const btnComprar = document.createElement("button");
        btnComprar.className = "btn btn-primary btn-agregar-carrito"; 
        btnComprar.textContent = "Añadir al carrito";
        btnComprar.disabled = producto.cantidad <= 0; // Deshabilitar si no hay stock
        btnComprar.dataset.id = producto.id; 
        if(btnComprar.disabled==true){
            btnComprar.className = "btn btn-primary btn-agregar-carrito"; 
        }

        // Ensamblar todos los componentes
        imgContainer.appendChild(img);
        carta_mostrar.appendChild(imgContainer);
        cardBody.appendChild(titulo);
        cardBody.appendChild(descripcion);
        cardBody.appendChild(disponibilidad);
        cardBody.appendChild(btnComprar); 
        carta_mostrar.appendChild(cardBody);
        colDiv.appendChild(carta_mostrar);
        div_mostrar.appendChild(colDiv);

        // Añadir evento al botón
        btnComprar.addEventListener('click', function() {
            agregarAlCarrito(producto); // Llamar a la función para añadir al carrito
        });

        // Ensamblar todos los componentes
        imgContainer.appendChild(img);
        carta_mostrar.appendChild(imgContainer);
        cardBody.appendChild(titulo);
        cardBody.appendChild(descripcion);
        cardBody.appendChild(disponibilidad);
        cardBody.appendChild(btnComprar); 
        carta_mostrar.appendChild(cardBody);
        colDiv.appendChild(carta_mostrar);
        div_mostrar.appendChild(colDiv);
    }
}

// Función para formatear el precio
function formatearPrecio(precio) {
    // Asume que el precio es un número
    return precio.toLocaleString('es-CL', { //tolocalString convierte un número en una cadena de texto formateada según las convenciones de un idioma y una región específicos
        style: 'currency',
        currency: 'COP'
    });
}

// Configurar filtros
document.addEventListener('DOMContentLoaded', function() {
    // Configurar el botón de aplicar filtros
    const boton_aplicar_filtros = document.getElementById('aplicar_filtros');
    if (boton_aplicar_filtros) {
        boton_aplicar_filtros.addEventListener('click', function() {
            aplicarFiltros();
        });
    }
    
    // Configurar el botón de limpiar filtros
    const boton_limpiar_filtros = document.getElementById('limpiar_filtros');
    if (boton_limpiar_filtros) {
        boton_limpiar_filtros.addEventListener('click', function() {
            limpiarFiltros();
        });
    }
});

// Función para aplicar filtros
function aplicarFiltros() {
    const checkboxes = document.querySelectorAll('.filtro-categoria:checked');
    const filtrosSeleccionados = Array.from(checkboxes).map(checkbox => checkbox.value); // Convertir a un arreglo de valores

    localStorage.setItem('filtrosSeleccionados', JSON.stringify(filtrosSeleccionados));

    if (filtrosSeleccionados.length > 0) {
        console.log("Filtros aplicados:", filtrosSeleccionados);
        imprimir_productos(filtrosSeleccionados); // Mostrar productos filtrados
    } else {
        console.log("No se seleccionaron filtros. Mostrando todos los productos.");
        imprimir_productos(); // Mostrar todos los productos si no hay filtros
    }
}

// Función para limpiar filtros
function limpiarFiltros() {
    const checkboxes = document.querySelectorAll('.filtro-categoria');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false; // Desmarcar todos los checkboxes
    });
    localStorage.removeItem('filtrosSeleccionados');

    console.log("Filtros limpiados. Mostrando todos los productos.");
    imprimir_productos(); // Llamar a imprimir_productos sin filtros
}