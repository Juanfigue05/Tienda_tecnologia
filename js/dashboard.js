document.addEventListener("DOMContentLoaded", function () {
    const boton_ingresar_inventario = document.getElementById("boton_ingresar_inventario");
    const boton_consultar_inventario = document.getElementById("boton_consultar_inventario");
    const boton_informe_ventas = document.getElementById("boton_informe_ventas");
    const boton_agregar_productos = document.getElementById("agregar_producto");

    const ingresar_inventario = document.getElementById("ingresar_inventario");
    const consultar_inventario = document.getElementById("consultar_inventario");
    const informe_ventas = document.getElementById("informe_ventas");

    const tipo = document.getElementById("tipo");
    const marca = document.getElementById("marca");
    const modelo = document.getElementById("modelo");

    // Ocultar todas las secciones al inicio
    ingresar_inventario.style.display = "none";
    consultar_inventario.style.display = "none";
    informe_ventas.style.display = "none";

    boton_ingresar_inventario.addEventListener("click", function() {
        ingresar_inventario.style.display = "block";
        consultar_inventario.style.display = "none";
        informe_ventas.style.display = "none";
        imprimir_productos();
        imprimir_tipo();
    });
    
    boton_consultar_inventario.addEventListener("click", function() {
        ingresar_inventario.style.display = "none";
        consultar_inventario.style.display = "block";
        informe_ventas.style.display = "none";
        imprimir_productos();
        imprimir_tipo();
        imprimir_marca();
        imprimir_modelo();
    });
    
    boton_informe_ventas.addEventListener("click", function() {
        ingresar_inventario.style.display = "none";
        consultar_inventario.style.display = "none";
        informe_ventas.style.display = "block";
    });

    // Inicializaciones
    llenarFiltroTipo(); // Inicializar el filtro de tipo para la tabla
    imprimir_productos(); // Mostrar todos los productos en la tabla
    imprimir_tipo_modificar(); // Inicializar el selector de tipo para modificar precio
});

// Traer la información del JSON en la carpeta otros
const url = "./otros/componentes.json";

fetch(url)
    .then(response => response.json())
    .then(data => {
        if (!sessionStorage.getItem("productos")) { // Solo inicializa si no hay datos en sessionStorage
            sessionStorage.setItem("productos", JSON.stringify(data.componentes));
            console.log("Datos iniciales guardados en sessionStorage:", data.componentes);
        }

        // Mostrar los datos en consola del JSON
        const productos = JSON.parse(sessionStorage.getItem("productos"));
        console.log("Datos del JSON:", productos);
    })
    .catch(error => console.error('Error al cargar el JSON:', error));

function imprimir_tipo() {
    const productos = JSON.parse(sessionStorage.getItem("productos")) || [];
    
    // Crear un Set para almacenar tipos únicos
    const tiposUnicos = new Set();
    
    // Añadir cada tipo al Set
    for (let i = 0; i < productos.length; i++) {
        tiposUnicos.add(productos[i].tipo);
    }
    
    const tipo = document.getElementById("tipo");
    tipo.innerHTML = '';
    
    const opcion_inicial = document.createElement("option");
    opcion_inicial.value = "";
    opcion_inicial.textContent = "-- Seleccione el tipo de producto --";
    tipo.appendChild(opcion_inicial);
    
    // Convertir el Set a Array y recorrerlo para crear las opciones
    Array.from(tiposUnicos).forEach(tipoUnico => {
        const option = document.createElement("option");
        option.value = tipoUnico; // Asignar el valor único al atributo value
        option.textContent = tipoUnico; // Asignar el texto visible
        tipo.appendChild(option); // Agregar la opción al select
    });

    tipo.addEventListener("change", function(){
        imprimir_marca();
        document.getElementById("modelo").innerHTML = '<option value="">-- Seleccione el modelo --</option>';
    });
}

function imprimir_tipo_modificar() {
    const productos = JSON.parse(sessionStorage.getItem("productos")) || [];
    const tipo_modificar = document.getElementById("tipo_modificar");

    if (!tipo_modificar) return; // Asegurarse de que el elemento existe

    // Crear un Set para almacenar tipos únicos
    const tiposUnicos = new Set();
    productos.forEach(producto => tiposUnicos.add(producto.tipo));

    // Limpiar el select antes de llenarlo
    tipo_modificar.innerHTML = '<option value="">-- Seleccione el tipo de producto --</option>';

    // Añadir las opciones al select
    Array.from(tiposUnicos).forEach(tipoUnico => {
        const option = document.createElement("option");
        option.value = tipoUnico;
        option.textContent = tipoUnico;
        tipo_modificar.appendChild(option);
    });

    // Escuchar cambios en el select de tipo
    tipo_modificar.addEventListener("change", function () {
        imprimir_marca_modificar();
        document.getElementById("modelo_modificar").innerHTML = '<option value="">-- Seleccione el modelo --</option>';
    });
}

function imprimir_marca() {
    const productos = JSON.parse(sessionStorage.getItem("productos")) || [];
    const tipo = document.getElementById("tipo");
    const marca = document.getElementById("marca");
    
    marca.innerHTML = '<option value="">-- Seleccione la marca --</option>';

    if (!tipo || !tipo.value) {
        return;
    }

    // Filtrar productos por el tipo seleccionado y obtener marcas únicas
    const marcasUnicas = [...new Set(
        productos
            .filter(producto => producto.tipo === tipo.value)
            .map(producto => producto.marca)
    )].sort();
    
    // Añadir las opciones al select
    marcasUnicas.forEach(marcas => {
        const option = document.createElement("option");
        option.value = marcas;
        option.textContent = marcas;
        marca.appendChild(option);
    });
    
    // Añadir un event listener para que al cambiar la marca se actualicen los modelos
    marca.addEventListener("change", imprimir_modelo);
}

function imprimir_marca_modificar() {
    const productos = JSON.parse(sessionStorage.getItem("productos")) || [];
    const tipo_modificar = document.getElementById("tipo_modificar");
    const marca_modificar = document.getElementById("marca_modificar");

    if (!marca_modificar || !tipo_modificar) return;

    // Limpiar el select antes de llenarlo
    marca_modificar.innerHTML = '<option value="">-- Seleccione la marca --</option>';

    if (!tipo_modificar.value) return;

    // Filtrar productos por el tipo seleccionado y obtener marcas únicas
    const marcasUnicas = [...new Set(
        productos
            .filter(producto => producto.tipo === tipo_modificar.value)
            .map(producto => producto.marca)
    )].sort();

    // Añadir las opciones al select
    marcasUnicas.forEach(marca => {
        const option = document.createElement("option");
        option.value = marca;
        option.textContent = marca;
        marca_modificar.appendChild(option);
    });

    // Escuchar cambios en el select de marca
    marca_modificar.addEventListener("change", imprimir_modelo_modificar);
}

function imprimir_modelo() {
    const productos = JSON.parse(sessionStorage.getItem("productos")) || [];
    const tipo = document.getElementById("tipo");
    const marca = document.getElementById("marca");
    const modelo = document.getElementById("modelo");
    
    //opcion inicial
    modelo.innerHTML = '<option value="">-- Seleccione el modelo --</option>';

    if (!tipo || !tipo.value || !marca || !marca.value) {
        return;
    }

    // Filtrar productos por el tipo y marca seleccionados para obtener modelos únicos
    const modelosUnicos = [...new Set(
        productos
        .filter(producto => 
            producto.tipo === tipo.value && 
            producto.marca === marca.value)
        .map(producto => producto.modelo) // el map ayuda a extraer los modelos que tengan como tipo lo que este en tipo.value y la marca este marca.value
    )].sort();
    
    // Añadir las opciones al select
    modelosUnicos.forEach(modelos => {
        const option = document.createElement("option");
        option.value = modelos;
        option.textContent = modelos;
        modelo.appendChild(option);
    });
}

function imprimir_modelo_modificar() {
    const productos = JSON.parse(sessionStorage.getItem("productos")) || [];
    const tipo_modificar = document.getElementById("tipo_modificar");
    const marca_modificar = document.getElementById("marca_modificar");
    const modelo_modificar = document.getElementById("modelo_modificar");

    if (!modelo_modificar || !tipo_modificar || !marca_modificar) return;

    // Limpiar el select antes de llenarlo
    modelo_modificar.innerHTML = '<option value="">-- Seleccione el modelo --</option>';

    if (!tipo_modificar.value || !marca_modificar.value) return;

    // Filtrar productos por el tipo y la marca seleccionados y obtener modelos únicos
    const modelosUnicos = [...new Set(
        productos
            .filter(producto =>
                producto.tipo === tipo_modificar.value &&
                producto.marca === marca_modificar.value
            )
            .map(producto => producto.modelo)
    )].sort();

    // Añadir las opciones al select
    modelosUnicos.forEach(modelo => {
        const option = document.createElement("option");
        option.value = modelo;
        option.textContent = modelo;
        modelo_modificar.appendChild(option);
    });
}

// Asegurar que el botón de agregar producto existe antes de asignarle un evento
document.addEventListener('DOMContentLoaded', function() {
    const boton_agregar_productos = document.getElementById("agregar_producto");
    if (boton_agregar_productos) {
        boton_agregar_productos.addEventListener('click', function(event) {
            event.preventDefault(); // Prevenir que la página se recargue

            const productos = JSON.parse(sessionStorage.getItem("productos")) || [];
            const tipo = document.getElementById("tipo");
            const marca = document.getElementById("marca");
            const modelo = document.getElementById("modelo");
            const cantidadInput = document.getElementById("cantidad");
            
            if (!tipo.value || !marca.value || !modelo.value || !cantidadInput.value) {
                alert("Por favor, complete todos los campos");
                return;
            }
            
            const cantidadagregar = parseInt(cantidadInput.value);
            if (isNaN(cantidadagregar) || cantidadagregar <= 0) {
                alert("Por favor, ingrese una cantidad válida");
                return;
            }
            
            let productoEncontrado = false;
            
            for (let i = 0; i < productos.length; i++) {
                const producto = productos[i];
                if (tipo.value === producto.tipo && marca.value === producto.marca && modelo.value === producto.modelo) {
                    console.log("Antes de agregar: " + producto.cantidad);
                    producto.cantidad = parseInt(producto.cantidad || 0) + cantidadagregar;
                    alert("La cantidad de producto ha sido agregada exitosamente.");
                    console.log("Cantidad agregada: " + cantidadagregar + " total: " + producto.cantidad);
                    productoEncontrado = true;
                    break;
                }
            }
            
            if (!productoEncontrado) {
                alert("Producto no encontrado. Verifique la selección.");
                return;
            }

            // Guardar el arreglo actualizado en el sessionStorage
            sessionStorage.setItem("productos", JSON.stringify(productos));
            console.log("Productos actualizados guardados en sessionStorage:", productos);

            // Actualizar la tabla después de guardar
            imprimir_productos();
            
            // Limpiar el formulario
            cantidadInput.value = "";
        });
    }
});

// Función para cargar ventas al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    // Obtener las ventas desde sessionStorage
    const ventas = JSON.parse(sessionStorage.getItem('ventas')) || [];
    const informeVentasTabla = document.getElementById('informe_ventas_tabla');
    const totalGananciaElemento = document.getElementById('total_vendido');
    
    if (!informeVentasTabla || !totalGananciaElemento) return;

    let totalGanancia = 0;

    informeVentasTabla.innerHTML = '';

    ventas.forEach((venta, index) => {
        const fila = document.createElement('tr');
        const columnaNumero = document.createElement('td');
        const columnaProducto = document.createElement('td');
        const columnaCantidad = document.createElement('td');
        const columnaSubtotal = document.createElement('td');
        const columnaFecha = document.createElement('td');
        
        columnaNumero.textContent = "Venta - " + venta.numeroVenta;
        columnaProducto.textContent = venta.tipo + " / " + venta.marca + " / " + venta.modelo;
        columnaCantidad.textContent = venta.cantidad;
        columnaSubtotal.textContent = formatearPrecio(venta.subtotal);
        columnaFecha.textContent = venta.fecha + " / " + venta.hora;

        fila.appendChild(columnaNumero);
        fila.appendChild(columnaProducto);
        fila.appendChild(columnaCantidad);
        fila.appendChild(columnaSubtotal);
        fila.appendChild(columnaFecha);

        informeVentasTabla.appendChild(fila);

        totalGanancia += venta.subtotal;
    });
    totalGananciaElemento.textContent = formatearPrecio(totalGanancia);

    sessionStorage.setItem('totalGanancia', totalGanancia.toString());
});

// Función para formatear el precio
function formatearPrecio(precio) {
    return precio.toLocaleString('es-CL', {
        style: 'currency',
        currency: 'COP'
    });
}

function imprimir_productos(filtroTipo = "") {
    const tabla = document.getElementById("inventario_tabla");
    if (!tabla) return;
    
    const productos = JSON.parse(sessionStorage.getItem("productos")) || [];

    tabla.innerHTML = "";
    
    // Filtrar los productos según el tipo seleccionado
    const productosFiltrados = filtroTipo
        ? productos.filter(producto => producto.tipo === filtroTipo)
        : productos;

    // Recorremos el array de productos filtrados
    productosFiltrados.forEach((producto, index) => {
        const fila = document.createElement("tr"); // Crear una nueva fila para el producto
        const celdaID = document.createElement("td"); // Crear una celda para el ID
        const celdaTipo = document.createElement("td"); // Crear una celda para el tipo
        const celdaNombre = document.createElement("td"); // Crear una celda para el nombre
        const celdaCantidad = document.createElement("td"); // Crear una celda para la cantidad
        const celdaEspecificaciones = document.createElement("td"); // Crear una celda para las especificaciones
        const celdaPrecio = document.createElement("td"); // Crear una celda para el precio

        celdaID.textContent = index + 1; // Asignar el ID a la celda
        celdaTipo.textContent = producto.tipo; // Asignar el tipo a la celda
        celdaNombre.textContent = producto.marca + " " + producto.modelo; // Asignar el nombre a la celda
        celdaCantidad.textContent = producto.cantidad || 0; // Asignar la cantidad a la celda
        
        // Determinar las especificaciones según el tipo de producto
        if (producto.tipo == "Monitor") {
            celdaEspecificaciones.textContent = (producto.conexiones ? producto.conexiones.join(", ") : "") + 
                                               ", " + (producto.pulgadas ? producto.pulgadas + " pulgadas" : "") + 
                                               ", " + (producto.resolucion || "");
        } else if (producto.tipo == "Teclado") {
            celdaEspecificaciones.textContent = (producto.conexiones ? producto.conexiones.join(", ") : "") + 
                                               ", Estilo:" + (producto.estilo || "") + 
                                               ", " + (producto.tiene_rgb || "");
        } else if (producto.tipo == "Mouse") {
            celdaEspecificaciones.textContent = (producto.estilo || "") + ", " + (producto.tiene_rgb || "");
        } else if (producto.tipo == "Luces") {
            celdaEspecificaciones.textContent = "color:" + (producto.color || "") + 
                                               ", " + "Tamaño" + (producto.tamaño || "") + 
                                               ", " + (producto.controlador || "");
        } else if (producto.tipo == "Chasis") {
            celdaEspecificaciones.textContent = "Medidas: " + (producto.medidas || "");
        } else if (producto.tipo == "Placa madre") {
            celdaEspecificaciones.textContent = (producto.conexiones ? producto.conexiones.join(", ") : "") + 
                                               ", " + (producto.cantidad_slot_ram ? producto.cantidad_slot_ram + " slots RAM" : "") + 
                                               ", " + (producto.procesador_maximo || "");
        } else if (producto.tipo == "Memoria RAM") {
            celdaEspecificaciones.textContent = "Capacidad ram:" + (producto.tamaño || "") + 
                                               ", Frecuencia maxima:" + (producto.frecuencia_maxima || "") + 
                                               ", " + (producto.tipo_ram || "");
        } else if (producto.tipo == "Disco duro") {
            celdaEspecificaciones.textContent = "Tipo disco:" + (producto.tipo_disco || "") + 
                                               ", " + (producto.tipo_almacenamiento || "") + 
                                               ", " + (producto.capacidad || "") + 
                                               ", " + (producto.velocidad_lectura || "");
        } else if (producto.tipo == "Procesador") {
            celdaEspecificaciones.textContent = "Frecuencia Maxima" + (producto.frecuencia_maxima || "") + 
                                               ", " + (producto.generacion || "") + 
                                               ", " + (producto.caracteristica_especial || "") + 
                                               ", " + (producto.nucleos ? producto.nucleos + " nucleos" : "") + 
                                               ", " + (producto.hilos ? producto.hilos + " hilos" : "");
        } else if (producto.tipo == "Tarjeta grafica") {
            celdaEspecificaciones.textContent = "Frecuencia Maxima" + (producto.frecuencia_maxima || "") + 
                                               ", " + (producto.año_creacion || "") + 
                                               ", " + (producto.memoria || "");
        } else if (producto.tipo == "Camara web hd") {
            celdaEspecificaciones.textContent = (producto.conexion || "") + 
                                               ", " + (producto.fecha_creacion || "");
        } else {
            celdaEspecificaciones.textContent = "No hay especificaciones";
        }
        
        celdaPrecio.textContent = producto.precio ? "$" + producto.precio : "$0"; // Asignar el precio a la celda
        
        fila.appendChild(celdaID);
        fila.appendChild(celdaTipo);
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaCantidad);
        fila.appendChild(celdaEspecificaciones);
        fila.appendChild(celdaPrecio);
        tabla.appendChild(fila);
    });
}

// Añadir el event listener para el formulario de modificar precio
document.addEventListener('DOMContentLoaded', function() {
    const formularioModificarPrecio = document.getElementById("formularioModificarPrecio");
    if (formularioModificarPrecio) {
        formularioModificarPrecio.addEventListener("submit", function (e) {
            e.preventDefault(); // Evitar que la página se recargue

            const productos = JSON.parse(sessionStorage.getItem("productos")) || [];
            const tipo = document.getElementById("tipo_modificar").value;
            const marca = document.getElementById("marca_modificar").value;
            const modelo = document.getElementById("modelo_modificar").value;
            const nuevoPrecio = parseFloat(document.getElementById("nuevo_precio").value);

            if (!tipo || !marca || !modelo || isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
                alert("Por favor, complete todos los campos con valores válidos.");
                return;
            }

            // Buscar el producto por tipo, marca y modelo
            const producto = productos.find(p =>
                p.tipo === tipo &&
                p.marca === marca &&
                p.modelo === modelo
            );

            if (!producto) {
                alert("Producto no encontrado. Por favor, seleccione un producto válido.");
                return;
            }

            // Actualizar el precio del producto
            producto.precio = nuevoPrecio;
            sessionStorage.setItem("productos", JSON.stringify(productos));

            alert("El precio del producto "+producto.tipo + " - " + producto.marca + " - " + producto.modelo + " ha sido actualizado a " + nuevoPrecio.toLocaleString('es-CL', { style: 'currency', currency: 'COP' }) + ".");

            // Actualizar la tabla
            imprimir_productos();
            
            // Limpiar el formulario
            formularioModificarPrecio.reset();
        });
    }
});

function llenarFiltroTipo() {
    const productos = JSON.parse(sessionStorage.getItem("productos")) || [];
    const filtroTipo = document.getElementById("filtro_tipo");
    
    if (!filtroTipo) return;

    const tiposUnicos = new Set();  // Crear un Set para almacenar tipos únicos

    productos.forEach(producto => tiposUnicos.add(producto.tipo));// Añadir cada tipo al Set

    filtroTipo.innerHTML = '<option value="">-- Todos los Tipos --</option>';

    Array.from(tiposUnicos).forEach(tipo => { // Añadir las opciones al select
        const option = document.createElement("option");
        option.value = tipo;
        option.textContent = tipo;
        filtroTipo.appendChild(option);
    });

    filtroTipo.addEventListener("change", function () {
        imprimir_productos(filtroTipo.value); // Filtrar la tabla por el tipo seleccionado
    });
}