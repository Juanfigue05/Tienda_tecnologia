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
        imprimir_productos();
        // Verificar si hay productos filtrados
    })
    .catch(error => console.error('Error al cargar el JSON:', error));

// Función para imprimir todos los productos
function imprimir_productos(filtros = []) {
    const div_mostrar = document.getElementById("productos");
    const productos = JSON.parse(localStorage.getItem("productos"));
    div_mostrar.innerHTML = "";

    // Filtrar productos si hay filtros activos
    let productosFiltrados = productos;
    if (filtros.length > 0) {
        productosFiltrados = productos.filter(producto => filtros.includes(producto.tipo));
    }

    // Si no hay productos que mostrar después de filtrar
    if (productosFiltrados.length === 0) {
        div_mostrar.innerHTML = `
            <div class="col-12 text-center py-5">
                <h3 class="text-muted">No se encontraron productos con los filtros seleccionados</h3>
                <p>Intenta con otros filtros o limpia la selección</p>
            </div>
        `;
        return;
    }

    // Mostrar los productos
    for (let i = 0; i < productosFiltrados.length; i++) {
        const producto = productosFiltrados[i];
        
        // Crear columna responsiva - en pantallas grandes 4 por fila, medianas 3, pequeñas 2
        const colDiv = document.createElement('div');
        colDiv.className = "col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4";
        
        // Crear la tarjeta del producto
        const carta_mostrar = document.createElement('div');
        carta_mostrar.className = "card h-100 shadow-sm producto-card";
        
        // Crear contenedor para la imagen con altura fija
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
        titulo.textContent = `${producto.tipo} - ${producto.marca} - ${producto.modelo}`;
        
        // Crear descripción
        const descripcion = document.createElement("p");
        descripcion.className = "card-text small";
        
        // Establecer descripción según el tipo de producto
        if (producto.tipo == "Monitor") {
            descripcion.innerHTML = `Conexiones: ${producto.conexiones.join(", ")}<br>Pulgadas: ${producto.pulgadas}" <br>Resolución máx: ${producto.resolucion}`;
        } else if (producto.tipo == "Teclado") {
            descripcion.innerHTML = `Conexiones:${producto.conexiones.join(", ")}, <br>Estilo: ${producto.estilo}<br>Rgb:${producto.tiene_rgb}`;
        } else if (producto.tipo == "Mouse") {
            descripcion.innerHTML = `Estilo:${producto.estilo}<br>Rgb:${producto.tiene_rgb}`;
        } else if (producto.tipo == "Luces") {
            descripcion.innerHTML = `Color: ${producto.color}<br>Tamaño: ${producto.tamaño}<br>Controlador:${producto.controlador}`;
        } else if (producto.tipo == "Chasis") {
            descripcion.innerHTML = `Medidas: ${producto.medidas}`;
        } else if (producto.tipo == "Placa madre") {
            descripcion.innerHTML = `Conexiones:${producto.conexiones.join(", ")}<br>Slost ram:${producto.cantidad_slot_ram} slots<br>Procesador max:${producto.procesador_maximo}`;
        } else if (producto.tipo == "Memoria RAM") {
            descripcion.innerHTML = `Capacidad: ${producto.tamaño}<br>Frecuencia máxima: ${producto.frecuencia_maxima}<br>Tipo:${producto.tipo_ram}`;
        } else if (producto.tipo == "Disco duro") {
            descripcion.innerHTML = `Tipo: ${producto.tipo_disco}<br>Almacenamiento:${producto.tipo_almacenamiento}<br>Capacidad:${producto.capacidad}<br>Lectura:${producto.velocidad_lectura}`;
        } else if (producto.tipo == "Procesador") {
            descripcion.innerHTML = `Frecuencia máxima: ${producto.frecuencia_maxima}<br>Generacion:${producto.generacion}<br># Nucleos:${producto.nucleos} núcleos<br># Hilos:${producto.hilos} hilos`;
        } else if (producto.tipo == "Tarjeta grafica") {
            descripcion.innerHTML = `Frecuencia máxima: ${producto.frecuencia_maxima}<br>${producto.año_creacion}<br>${producto.memoria}`;
        } else if (producto.tipo == "Camara web hd") {
            descripcion.innerHTML = `Conexiones: ${producto.conexion}<br>Año creación: ${producto.fecha_creacion}`;
        } else {
            descripcion.innerHTML = "No hay especificaciones";
        }
        
        // Footer de la tarjeta
        const cardFooter = document.createElement("div");
        cardFooter.className = "card-footer bg-white border-top-0";
        
        // Precio del producto
        const precio = document.createElement("h5");
        precio.className = "text-success mb-2";
        precio.textContent = formatearPrecio(producto.precio);
        
        // Disponibilidad del producto
        const disponibilidad = document.createElement("span");
        if (producto.cantidad > 0) {
            disponibilidad.textContent = "Disponible";
            disponibilidad.className = "badge bg-success";
        } else {
            disponibilidad.textContent = "Agotado";
            disponibilidad.className = "badge bg-danger";
        }
        
        // Botón para añadir al carrito
        const btnComprar = document.createElement("button");
        btnComprar.className = "btn btn-primary w-100 mt-2";
        btnComprar.textContent = "Añadir al carrito";
        btnComprar.disabled = producto.cantidad <= 0;
        btnComprar.dataset.productoId = i; // Almacenar el índice del producto
        
        // Añadir evento al botón (ejemplo)
        btnComprar.addEventListener('click', function() {
            agregarAlCarrito(producto);
        });
        
        // Ensamblar todos los componentes
        imgContainer.appendChild(img);
        carta_mostrar.appendChild(imgContainer);
        
        cardBody.appendChild(titulo);
        cardBody.appendChild(descripcion);
        carta_mostrar.appendChild(cardBody);
        
        cardFooter.appendChild(precio);
        cardFooter.appendChild(disponibilidad);
        cardFooter.appendChild(btnComprar);
        carta_mostrar.appendChild(cardFooter);
        
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

// Función para agregar al carrito (ejemplo)
function agregarAlCarrito(producto) {
    // Implementar lógica para agregar al carrito
    console.log(`Producto añadido al carrito: ${producto.marca} ${producto.modelo}`);
    
    // Mostrar notificación
    alert(`¡${producto.tipo} ${producto.marca} ${producto.modelo} añadido al carrito!`);
}

// Configurar filtros
document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos al cargar la página
    imprimir_productos();
    
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
    const filtros_Seleccionados = Array.from(checkboxes).map(checkbox => checkbox.value); //convierte una colección de checkboxes en un arreglo 
    imprimir_productos(filtros_Seleccionados);
}

// Función para limpiar filtros
function limpiarFiltros() {
    const checkboxes = document.querySelectorAll('.filtro-categoria');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    })
    imprimir_productos();
}