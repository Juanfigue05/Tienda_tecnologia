// carrito_compra.js
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el carrito desde sessionStorage o crear uno nuevo si no existe
    let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
    let total = parseFloat(sessionStorage.getItem('totalCarrito')) || 0;
    
    // Actualizar contador y total en todas las páginas
    actualizarContadorCarrito();
    actualizarVistaCarrito();
    
    // Escuchar eventos de click para agregar productos (solo en página de productos)
    if (document.getElementById('productos')) {
        const productosContainer = document.getElementById('productos');
        productosContainer.addEventListener('click', function(event) {
            // Comprobar si se hizo clic en un botón de agregar al carrito
            if (event.target.classList.contains('btn-agregar-carrito')) {
                const productId = event.target.getAttribute('data-id');
                agregarAlCarrito(productId);
            }
        });
    }
    
    // Escuchar eventos para eliminar productos del carrito
    const carritoContainer = document.getElementById('informacion_compras');
    if (carritoContainer) {
        carritoContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('btn-eliminar')) {
                const productId = event.target.getAttribute('data-id');
                eliminarDelCarrito(productId);
            }
        });
    }
    
    function agregarAlCarrito(productId) {
        // Obtener productos del sessionStorage
        const productos = JSON.parse(sessionStorage.getItem('productos'));
        
        // Buscar el producto por ID
        const producto = productos.find(item => item.id === parseInt(productId));
        
        if (!producto) {
            console.error('Producto no encontrado');
            return;
        }
        
        if (producto.cantidad <= 0) {
            alert('Lo sentimos, este producto está agotado');
            return;
        }
        
        // Verificar si el producto ya está en el carrito
        const itemEnCarrito = carrito.find(item => item.id === parseInt(productId));
        
        if (itemEnCarrito) {
            // Si ya está en el carrito, aumentar la cantidad
            if (itemEnCarrito.cantidad < producto.cantidad) {
                itemEnCarrito.cantidad++;
                itemEnCarrito.subtotal = itemEnCarrito.precio * itemEnCarrito.cantidad;
                
                // Reducir la existencia en el producto original
                producto.cantidad--;
            } else {
                alert('No hay más unidades disponibles de este producto');
                return;
            }
        } else {
            // Si no está en el carrito, agregar con cantidad 1
            console.log(producto.cantidad);
            carrito.push({
                id: producto.id,
                tipo: producto.tipo,
                marca: producto.marca,
                modelo: producto.modelo,
                precio: producto.precio,
                img: producto.img,
                cantidad: 1,
                subtotal: producto.precio
            });

            // Reducir la existencia en el producto original
            producto.cantidad--;
            console.log(producto.cantidad);
        }
        
        // Actualizar el total del carrito
        calcularTotal();
        
        // Actualizar productos y carrito en sessionStorage
        sessionStorage.setItem('productos', JSON.stringify(productos));
        sessionStorage.setItem('carrito', JSON.stringify(carrito));
        sessionStorage.setItem('totalCarrito', total.toString());
        
        const filtrosSeleccionados = JSON.parse(sessionStorage.getItem('filtrosSeleccionados')) || [];
        imprimir_productos(filtrosSeleccionados);
        
        actualizarContadorCarrito();
        actualizarVistaCarrito();
        
        alert(producto.tipo+" "+producto.marca+" "+producto.modelo + " añadido al carrito!. ");
    }
    
    // Función para eliminar productos del carrito
    function eliminarDelCarrito(productId) {
        // Obtener productos del sessionStorage
        const productos = JSON.parse(sessionStorage.getItem('productos'));
        
        // Encontrar el producto en el carrito
        const itemIndex = carrito.findIndex(item => item.id === parseInt(productId));
        
        if (itemIndex === -1) {
            console.error('Producto no encontrado en el carrito');
            return;
        }
        // item del carrito que se va a eliminar
        const itemEnCarrito = carrito[itemIndex];
        
        // Encontrar el producto original para devolver las existencias
        const productoOriginal = productos.find(item => item.id === parseInt(productId));
        
        if (productoOriginal) {
            // Devolver existencias al producto original
            productoOriginal.cantidad += itemEnCarrito.cantidad;
            sessionStorage.setItem('productos', JSON.stringify(productos));
        }
        
        carrito.splice(itemIndex, 1);
        
        calcularTotal();
        
        sessionStorage.setItem('carrito', JSON.stringify(carrito));
        sessionStorage.setItem('totalCarrito', total.toString());
        
        actualizarContadorCarrito();
        actualizarVistaCarrito();
        
        // Si estamos en la página de productos, actualizar la vista de productos
        if (typeof imprimir_productos === 'function') {
            imprimir_productos();
        }
    }
    
    // Función para calcular el total del carrito
    function calcularTotal() {
        total = carrito.reduce((sum, item) => sum + item.subtotal, 0); //calcular el total de los subtotales de los elementos en el carrito de compras
        sessionStorage.setItem('totalCarrito', total.toString());
        return total;
    }
    
    // Función para actualizar el contador del carrito en el botón
    function actualizarContadorCarrito() {
        const cantidadTotal = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        const carritoBtn = document.getElementById('carrito_compra');
        
        if (carritoBtn) {
            carritoBtn.innerHTML = `<i class="fa-solid fa-cart-shopping" style="color: #ff5900;"> Carrito (${cantidadTotal})</i>`;
        }
    }
    
    // Función para actualizar la vista del carrito en el offcanvas
    function actualizarVistaCarrito() {
        const carritoContainer = document.getElementById('informacion_compras');
        if (!carritoContainer) return;
        
        if (carrito.length === 0) {
            carritoContainer.innerHTML = '<div class="text-center p-3">Tu carrito está vacío</div>';
            return;
        }
        
        const div_mostrar = document.createElement('div');
        div_mostrar.className = "row";
        
        for (let i = 0; i < carrito.length; i++) {
            const item = carrito[i];
            const colDiv = document.createElement('div');
            const carta_mostrar = document.createElement('div');
            const imgContainer = document.createElement('div');
            const img = document.createElement("img");
            const cardBody = document.createElement("div");
            const titulo = document.createElement("h5");
            const descripcion = document.createElement("p");
            const btnContainer = document.createElement("div");
            const btnEliminar = document.createElement("button");

            colDiv.className = "col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4";
            carta_mostrar.className = "card h-100 shadow-sm producto-card";
            imgContainer.className = "img-container text-center p-3";
            imgContainer.style.height = "150px";
            imgContainer.style.display = "flex";
            imgContainer.style.alignItems = "center";
            imgContainer.style.justifyContent = "center";

            img.src = item.img;
            img.className = "img-fluid";
            img.style.maxHeight = "120px";
            img.alt = item.modelo;

            cardBody.className = "card-body";
            titulo.className = "card-title";
            titulo.textContent = item.tipo + ' - ' + item.marca + ' - ' + item.modelo;
            descripcion.className = "card-text small";
            descripcion.innerHTML = `
                <strong>Precio:</strong> ${formatearPrecio(item.precio)}<br>
                <strong>Cantidad:</strong> ${item.cantidad}<br>
                <strong>Subtotal:</strong> ${formatearPrecio(item.subtotal)}
            `;

            btnContainer.className = "d-flex justify-content-end mt-2";
            btnEliminar.className = "btn btn-danger btn-sm btn-eliminar";
            btnEliminar.dataset.id = item.id;
            btnEliminar.innerHTML = '<i class="fa-solid fa-trash"></i>';

            btnContainer.appendChild(btnEliminar);
            imgContainer.appendChild(img);
            carta_mostrar.appendChild(imgContainer);
            cardBody.appendChild(titulo);
            cardBody.appendChild(descripcion);
            cardBody.appendChild(btnContainer);
            carta_mostrar.appendChild(cardBody);
            colDiv.appendChild(carta_mostrar);
            div_mostrar.appendChild(colDiv);
        }
        
        const resumenContainer = document.createElement('div');
        const resumenCard = document.createElement('div');
        const resumenBody = document.createElement('div');
        const totalRow = document.createElement('div');
        const totalLabel = document.createElement('h5');
        const totalValue = document.createElement('h5');
        const buttonsRow = document.createElement('div');
        const btnVaciar = document.createElement('button');
        const btnFinalizar = document.createElement('button');

        resumenContainer.className = "col-12";
        resumenCard.className = "card shadow-sm";
        resumenBody.className = "card-body";

        totalRow.className = "d-flex justify-content-between align-items-center mb-3";
        totalLabel.className = "fw-bold mb-0";
        totalLabel.textContent = "Total:";
        totalValue.className = "fw-bold mb-0";
        totalValue.textContent = formatearPrecio(total);
        totalRow.appendChild(totalLabel);
        totalRow.appendChild(totalValue);
        
        buttonsRow.className = "d-flex justify-content-end mt-3";
        btnVaciar.id = "btn-vaciar-carrito";
        btnVaciar.className = "btn btn-outline-danger me-2";
        btnVaciar.textContent = "Vaciar carrito";
        
        btnFinalizar.id = "btn-finalizar-compra";
        btnFinalizar.className = "btn btn-primary";
        btnFinalizar.textContent = "Finalizar compra";

        buttonsRow.appendChild(btnVaciar);
        buttonsRow.appendChild(btnFinalizar);
    
        resumenBody.appendChild(totalRow);
        resumenBody.appendChild(buttonsRow);
        resumenCard.appendChild(resumenBody);
        resumenContainer.appendChild(resumenCard);
        div_mostrar.appendChild(resumenContainer);

        carritoContainer.innerHTML = '';
        carritoContainer.appendChild(div_mostrar);
        
        const btnVaciarCarrito = document.getElementById('btn-vaciar-carrito');
        const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
        
        if (btnVaciarCarrito) {
            btnVaciarCarrito.addEventListener('click', vaciarCarrito);
        }
        
        if (btnFinalizarCompra) {
            btnFinalizarCompra.addEventListener('click', finalizarCompra);
        }
        
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        botonesEliminar.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                eliminarDelCarrito(id);
            });
        });
    }
    
    // Función para formatear el precio
    function formatearPrecio(precio) {
        return precio.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'COP'
        });
    }
    
    // Función para vaciar el carrito
    function vaciarCarrito() {
        if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
            // Obtener productos del sessionStorage
            const productos = JSON.parse(sessionStorage.getItem('productos'));
            
            // Devolver existencias a los productos originales
            carrito.forEach(item => {
                const productoOriginal = productos.find(prod => prod.id === item.id);
                if (productoOriginal) {
                    productoOriginal.cantidad += item.cantidad;
                }
            });
            
            sessionStorage.setItem('productos', JSON.stringify(productos));
            
            // Limpiar carrito
            carrito = [];
            total = 0;
            sessionStorage.setItem('carrito', JSON.stringify(carrito));
            sessionStorage.setItem('totalCarrito', total.toString());
            
            actualizarContadorCarrito();
            actualizarVistaCarrito();
            
            // Si estamos en la página de productos, actualizar la vista de productos
            if (typeof imprimir_productos === 'function') {
                imprimir_productos();
            }
        }
    }
    
    // Función para finalizar la compra
function finalizarCompra() {
    // Obtener las ventas existentes en sessionStorage o inicializar un arreglo vacío
    const ventas = JSON.parse(sessionStorage.getItem('ventas')) || [];
    const numeroVenta = ventas.length > 0 ? ventas[ventas.length - 1].numeroVenta + 1 : 1; // Incrementar el número de venta

    // Obtener la fecha y hora actual
    const fechaActual = new Date();
    const fechaVenta = fechaActual.toLocaleDateString(); // Formato: DD/MM/YYYY
    const horaVenta = fechaActual.toLocaleTimeString(); // Formato: HH:MM:SS

    // Recorrer los productos del carrito y agregarlos al arreglo de ventas
    carrito.forEach(item => {
        ventas.push({
            numeroVenta: numeroVenta, // Asignar el número de venta
            tipo: item.tipo,
            marca: item.marca,
            modelo: item.modelo,
            cantidad: item.cantidad,
            subtotal: item.subtotal,
            fecha: fechaVenta,
            hora: horaVenta
        });
    });

    // Guardar las ventas actualizadas en sessionStorage
    sessionStorage.setItem('ventas', JSON.stringify(ventas));

    // Mostrar mensaje de agradecimiento
    alert('¡Gracias por tu compra! Total: ' + formatearPrecio(total));

    // Limpiar carrito y no devolver existencias a productos
    carrito = [];
    total = 0;
    sessionStorage.setItem('carrito', JSON.stringify(carrito));
    sessionStorage.setItem('totalCarrito', total.toString());

    actualizarContadorCarrito();
    actualizarVistaCarrito();
}
});