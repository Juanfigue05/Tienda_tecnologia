const boton_ingresar_inventario = document.getElementById("boton_ingresar_inventario");
const boton_consultar_inventario = document.getElementById("boton_consultar_inventario");
const boton_informe_ventas = document.getElementById("boton_informe_ventas");


// agregar eventos para mostrar solo lo que necesite el administrador cuando de click
ingresar_inventario.style.display = "none";
consultar_inventario.style.display = "none";
informe_ventas.style.display = "none";

boton_ingresar_inventario.addEventListener("click", function() {
    ingresar_inventario.style.display = "block";
    consultar_inventario.style.display = "none";
    informe_ventas.style.display = "none";
});
boton_consultar_inventario.addEventListener("click", function() {
    ingresar_inventario.style.display = "none";
    consultar_inventario.style.display = "block";
    informe_ventas.style.display = "none";
    imprimir_productos();
});
boton_informe_ventas.addEventListener("click", function() {
    ingresar_inventario.style.display = "none";
    consultar_inventario.style.display = "none";
    informe_ventas.style.display = "block";
});

// Traer la información del JSON en la carpeta otros
const url = "./otros/componentes.json";

fetch(url)
    .then(response => response.json())
    .then(data => {
        // Acceder al arreglo dentro de la clave "componentes"
        const productos = data.componentes;

        // Guardar la información en el localStorage
        localStorage.setItem("productos", JSON.stringify(productos));
        console.log("Datos guardados en el localStorage:", productos);

        // Mostrar los datos en consola del JSON
        console.log("Datos del JSON:", productos);

    })
    .catch(error => console.error('Error al cargar el JSON:', error));

function imprimir_productos() {
    const tabla = document.getElementById("inventario_tabla");
    const productos = JSON.parse(localStorage.getItem("productos"));
    const inventario = JSON.parse(localStorage.getItem("inventario"));

    // Verificar si inventario es null
    if (!inventario) {
        console.error("El inventario no está definido en localStorage.");
        return;
    }

    console.log("Productos:", productos);

    // Limpiar la tabla antes de agregar nuevos productos
    tabla.innerHTML = ""; // Limpiar el contenido de la tabla
    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i]; // Obtener el producto actual
        const fila = document.createElement("tr"); // Crear una nueva fila para el producto
        const celdaID = document.createElement("td"); // Crear una celda para el ID
        const celdaTipo = document.createElement("td"); // Crear una celda para el tipo
        const celdaNombre = document.createElement("td"); // Crear una celda para el nombre
        const celdaCantidad = document.createElement("td"); // Crear una celda para la cantidad
        const celdaEspecificaciones = document.createElement("td"); // Crear una celda para las especificaciones
        const celdaPrecio = document.createElement("td"); // Crear una celda para el precio

        celdaID.textContent = i + 1; // Asignar el ID a la celda
        celdaTipo.textContent = producto.tipo; // Asignar el tipo a la celda
        celdaNombre.textContent = producto.marca + " " + producto.modelo; // Asignar el nombre a la celda
        celdaCantidad.textContent = inventario[i]?.cantidad || "No disponible"; // Asignar la cantidad a la celda
        if(inventario[i]?.tipo == producto.tipo){
            celdaCantidad.textContent = inventario[i].cantidad; // Asignar la cantidad a la celda
        }
        // Resto del código para asignar especificaciones y precio
        if (producto.tipo == "Monitor") {celdaEspecificaciones.textContent = producto.conexiones.join(", ") + ", " + producto.pulgadas + " pulgadas, " + producto.resolucion;
        } else if (producto.tipo == "Teclado") {celdaEspecificaciones.textContent = producto.conexiones.join(", ") + ", Estilo:" + producto.estilo + ", " + producto.tiene_rgb;
        } else if (producto.tipo == "Mouse") {celdaEspecificaciones.textContent = producto.estilo + ", " + producto.tiene_rgb;
        } else if (producto.tipo == "Luces") {celdaEspecificaciones.textContent = "color:"+ producto.color + ", " + "Tamaño"+producto.tamaño + ", " + producto.controlador;
        } else if (producto.tipo == "Chasis") {celdaEspecificaciones.textContent = "Medidas: "+producto.medidas;
        } else if (producto.tipo == "Placa madre") {celdaEspecificaciones.textContent = producto.conexiones.join(", ") + ", " + producto.cantidad_slot_ram + " slots RAM, " + producto.procesador_maximo;
        } else if (producto.tipo == "Memoria RAM") {celdaEspecificaciones.textContent = "Capacidad ram:"+producto.tamaño + ", Frecuencia maxima:" + producto.frecuencia_maxima + ", " + producto.tipo_ram;
        } else if (producto.tipo == "Disco duro") {celdaEspecificaciones.textContent = "Tipo disco:"+producto.tipo_disco + ", " + producto.tipo_almacenamiento + ", " + producto.capacidad + ", " + producto.velocidad_lectura;
        } else if (producto.tipo == "Procesador") {celdaEspecificaciones.textContent = "Frecuencia Maxima"+producto.frecuencia_maxima + ", " + producto.generacion + ", " + producto.caracteristica_especial + ", " + producto.nucleos + " nucleos, " + producto.hilos + " hilos";
        } else if (producto.tipo == "Tarjeta grafica") {celdaEspecificaciones.textContent = "Frecuencia Maxima"+producto.frecuencia_maxima + ", " + producto.año_creacion + ", " + producto.memoria;
        } else if (producto.tipo == "Camara web hd") {celdaEspecificaciones.textContent = producto.conexion + ", " + producto.fecha_creacion;
        } else {celdaEspecificaciones.textContent = "No hay especificaciones";}
        celdaPrecio.textContent = "$"+producto.precio; // Asignar el precio a la celda
        fila.appendChild(celdaID);
        fila.appendChild(celdaTipo);
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaCantidad);
        fila.appendChild(celdaEspecificaciones);
        fila.appendChild(celdaPrecio);
        tabla.appendChild(fila);
    }
}

