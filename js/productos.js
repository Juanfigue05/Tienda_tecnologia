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


function imprimir_productos(){
    const div_mostrar=document.getElementById("productos");
    const productos = JSON.parse(localStorage.getItem("productos"));
    div_mostrar.innerHTML="";

    for (let i = 0; i < productos.length; i++){
        const carta_mostrar = document.createElement('div');
        carta_mostrar.className ="text-center card col-lg-2 col-md-4 col-sm-6 carta_mostrar";

        const producto = productos[i]; // Obtener el producto actual
        const img = document.createElement("img"); // Crear una imagen
        const titulo = document.createElement("h3"); // Crear titulo
        const descripcion = document.createElement("p");  // Crear parrafo
        const precio = document.createElement("h4"); //Crear Titulo para el precio
        const disponibilidad =document.createElement("p");
        const contenedor_img =document.createElement("div");
        const card_body =document.createElement("div");

        contenedor_img.className="contenedor_img"
        img.src=producto.img;
        img.className = "card-img-top imagen_card";
        card_body.className="cad-body";
        titulo.textContent=producto.tipo+" - "+producto.marca+" - "+producto.modelo;
        titulo.className="card-title"

        if (producto.tipo == "Monitor") {descripcion.textContent = producto.conexiones.join(", ") + ", " + producto.pulgadas + " pulgadas, " + producto.resolucion;
        } else if (producto.tipo == "Teclado") {descripcion.textContent = producto.conexiones.join(", ") + ", Estilo:" + producto.estilo + ", " + producto.tiene_rgb;
        } else if (producto.tipo == "Mouse") {descripcion.textContent = producto.estilo + ", " + producto.tiene_rgb;
        } else if (producto.tipo == "Luces") {descripcion.textContent = "color:"+ producto.color + ", " + "Tamaño"+producto.tamaño + ", " + producto.controlador;
        } else if (producto.tipo == "Chasis") {descripcion.textContent = "Medidas: "+producto.medidas;
        } else if (producto.tipo == "Placa madre") {descripcion.textContent = producto.conexiones.join(", ") + ", " + producto.cantidad_slot_ram + " slots RAM, " + producto.procesador_maximo;
        } else if (producto.tipo == "Memoria RAM") {descripcion.textContent = "Capacidad ram:"+producto.tamaño + ", Frecuencia maxima:" + producto.frecuencia_maxima + ", " + producto.tipo_ram;
        } else if (producto.tipo == "Disco duro") {descripcion.textContent = "Tipo disco:"+producto.tipo_disco + ", " + producto.tipo_almacenamiento + ", " + producto.capacidad + ", " + producto.velocidad_lectura;
        } else if (producto.tipo == "Procesador") {descripcion.textContent = "Frecuencia Maxima"+producto.frecuencia_maxima + ", " + producto.generacion + ", " + producto.caracteristica_especial + ", " + producto.nucleos + " nucleos, " + producto.hilos + " hilos";
        } else if (producto.tipo == "Tarjeta grafica") {descripcion.textContent = "Frecuencia Maxima"+producto.frecuencia_maxima + ", " + producto.año_creacion + ", " + producto.memoria;
        } else if (producto.tipo == "Camara web hd") {descripcion.textContent = producto.conexion + ", " + producto.fecha_creacion;
        } else {descripcion.textContent = "No hay especificaciones";}
        precio.textContent=producto.precio;
        precio.className="card-title text-success"
        if(producto.cantidad>0){
            disponibilidad.textContent="Disponible";
            disponibilidad.className="badge bg-success";
        }else{
            disponibilidad.textContent="Agotado - No disponible";
            disponibilidad.className="badge bg-danger";
        }
         
        carta_mostrar.appendChild(img);
        carta_mostrar.appendChild(titulo);
        carta_mostrar.appendChild(descripcion);
        carta_mostrar.appendChild(precio);
        carta_mostrar.appendChild(disponibilidad);

        div_mostrar.appendChild(carta_mostrar);
    }
}