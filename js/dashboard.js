const boton_ingresar_inventario = document.getElementById("boton_ingresar_inventario");
const boton_consultar_inventario = document.getElementById("boton_consultar_inventario");
const boton_informe_ventas = document.getElementById("boton_informe_ventas");
const boton_agregar_productos = document.getElementById("agregar_producto")

const ingresar_inventario = document.getElementById("ingresar_inventario");
const consultar_inventario = document.getElementById("consultar_inventario");
const informe_ventas = document.getElementById("informe_ventas");

const tipo = document.getElementById("tipo");
const marca = document.getElementById("marca");
const modelo = document.getElementById("modelo");

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
        console.log("Datos del JSON:", productos);

    })
    .catch(error => console.error('Error al cargar el JSON:', error));

function imprimir_tipo() {
    const productos = JSON.parse(sessionStorage.getItem("productos"));
    
    // Crear un Set para almacenar tipos únicos
    const tiposUnicos = new Set();
    
    // Añadir cada tipo al Set
    for (let i = 0; i < productos.length; i++) {
        tiposUnicos.add(productos[i].tipo);
    }
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

    tipo.addEventListener("change",function(){
        imprimir_marca();
        document.getElementById("modelo").innerHTML= '<option value="">-- Seleccione el modelo --</option>';
    });
    
}

function imprimir_marca() {
    const productos = JSON.parse(sessionStorage.getItem("productos"));

    marca.innerHTML='<option value="">-- Seleccione la marca --</option>';

    if (!tipo) {
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


function imprimir_modelo() {
    const productos = JSON.parse(sessionStorage.getItem("productos"));
    
    //opcion inicial
    modelo.innerHTML='<option value="">-- Seleccione el modelo --</option>';

    if (!tipo || !marca) {
        return;
    }

    // Filtrar productos por el tipo seleccionado y obtener marcas únicas
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

boton_agregar_productos.addEventListener('click', function(event) {
    event.preventDefault(); // Prevenir que la página se recargue

    const productos = JSON.parse(sessionStorage.getItem("productos"));
    const cantidadagregar = document.getElementById("cantidad").value; // Obtener el valor de la cantidad
    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        if (tipo.value === producto.tipo && marca.value === producto.marca && modelo.value === producto.modelo) {
            console.log("Antes de agregar: " + producto.cantidad);
            producto.cantidad = parseInt(producto.cantidad || 0) + parseInt(cantidadagregar || 0); // Sumar la cantidad
            alert("La cantidad de producto ha sido agregada exitosamente.");
            console.log("Cantidad agregada: " + cantidadagregar + " total: " + producto.cantidad);
        }
    }

    // Guardar el arreglo actualizado en el sessionStorage
    sessionStorage.setItem("productos", JSON.stringify(productos));
    console.log("Productos actualizados guardados en sessionStorage:", productos);

    // Actualizar la tabla después de guardar
    imprimir_productos();
});

document.addEventListener('DOMContentLoaded', function () {
    // Obtener las ventas desde sessionStorage
    const ventas = JSON.parse(sessionStorage.getItem('ventas')) || [];
    const informeVentasTabla = document.getElementById('informe_ventas_tabla');
    const totalGananciaElemento = document.getElementById('total_vendido');

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

function imprimir_productos() {
    const tabla = document.getElementById("inventario_tabla");
    const productos = JSON.parse(sessionStorage.getItem("productos"));

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
        celdaCantidad.textContent = producto.cantidad; // Asignar la cantidad a la celda
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

