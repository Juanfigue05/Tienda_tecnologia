// carrito_compra.js
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el carrito desde localStorage o crear uno nuevo si no existe
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = parseFloat(localStorage.getItem('totalCarrito')) || 0;
    
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
    
    // Función para agregar productos al carrito
    function agregarAlCarrito(productId) {
        // Obtener productos del localStorage
        const productos = JSON.parse(localStorage.getItem('productos'));
        
        // Buscar el producto por ID
        const producto = productos.find(item => item.id === parseInt(productId));
        
        if (!producto) {
            console.error('Producto no encontrado');
            return;
        }
        
        // Verificar si hay existencias
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
        }
        
        // Actualizar el total del carrito
        calcularTotal();
        
        // Actualizar productos y carrito en localStorage
        localStorage.setItem('productos', JSON.stringify(productos));
        localStorage.setItem('carrito', JSON.stringify(carrito));
        localStorage.setItem('totalCarrito', total.toString());
        
        // Actualizar vista
        actualizarContadorCarrito();
        actualizarVistaCarrito();
        
        // Si estamos en la página de productos, actualizar la vista de productos
        if (typeof imprimir_productos === 'function') {
            imprimir_productos();
        }
        
        // Mostrar notificación
        alert(`¡${producto.tipo} ${producto.marca} ${producto.modelo} añadido al carrito!`);
    }
    
    // Función para eliminar productos del carrito
    function eliminarDelCarrito(productId) {
        // Obtener productos del localStorage
        const productos = JSON.parse(localStorage.getItem('productos'));
        
        // Encontrar el producto en el carrito
        const itemIndex = carrito.findIndex(item => item.id === parseInt(productId));
        
        if (itemIndex === -1) {
            console.error('Producto no encontrado en el carrito');
            return;
        }
        
        const itemEnCarrito = carrito[itemIndex];
        
        // Encontrar el producto original para devolver las existencias
        const productoOriginal = productos.find(item => item.id === parseInt(productId));
        
        if (productoOriginal) {
            // Devolver existencias al producto original
            productoOriginal.cantidad += itemEnCarrito.cantidad;
            localStorage.setItem('productos', JSON.stringify(productos));
        }
        
        // Eliminar del carrito
        carrito.splice(itemIndex, 1);
        
        // Actualizar total
        calcularTotal();
        
        // Actualizar localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        localStorage.setItem('totalCarrito', total.toString());
        
        // Actualizar vista
        actualizarContadorCarrito();
        actualizarVistaCarrito();
        
        // Si estamos en la página de productos, actualizar la vista de productos
        if (typeof imprimir_productos === 'function') {
            imprimir_productos();
        }
    }
    
    // Función para calcular el total del carrito
    function calcularTotal() {
        total = carrito.reduce((sum, item) => sum + item.subtotal, 0);
        localStorage.setItem('totalCarrito', total.toString());
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
        
        // Crear el contenedor principal
        const div_mostrar = document.createElement('div');
        div_mostrar.className = "row";
        
        // Recorrer los productos del carrito
        for (let i = 0; i < carrito.length; i++) {
            const item = carrito[i];
    
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
            img.src = item.img;
            img.className = "img-fluid";
            img.style.maxHeight = "180px";
            img.alt = item.modelo;
    
            // Cuerpo de la tarjeta
            const cardBody = document.createElement("div");
            cardBody.className = "card-body";
    
            // Crear título
            const titulo = document.createElement("h5");
            titulo.className = "card-title";
            titulo.textContent = `${item.tipo} - ${item.marca} - ${item.modelo}`;
    
            // Crear descripción
            const descripcion = document.createElement("p");
            descripcion.className = "card-text small";
            descripcion.innerHTML = `Precio: ${formatearPrecio(item.precio)}<br>Cantidad: ${item.cantidad}<br>Subtotal: ${formatearPrecio(item.subtotal)}`;
            
            // Crear botón de eliminar
            const btnContainer = document.createElement("div");
            btnContainer.className = "d-flex justify-content-end mt-2";
            
            const btnEliminar = document.createElement("button");
            btnEliminar.className = "btn btn-danger btn-sm btn-eliminar";
            btnEliminar.dataset.id = item.id;
            btnEliminar.innerHTML = '<i class="fa-solid fa-trash"></i>';
            
            btnContainer.appendChild(btnEliminar);
    
            // Ensamblar todos los componentes
            imgContainer.appendChild(img);
            carta_mostrar.appendChild(imgContainer);
            cardBody.appendChild(titulo);
            cardBody.appendChild(descripcion);
            cardBody.appendChild(btnContainer);
            carta_mostrar.appendChild(cardBody);
            colDiv.appendChild(carta_mostrar);
            div_mostrar.appendChild(colDiv);
        }
        
        // Crear el resumen del carrito (total y botones)
        const resumenContainer = document.createElement('div');
        resumenContainer.className = "col-12";
        
        const resumenCard = document.createElement('div');
        resumenCard.className = "card shadow-sm";
        
        const resumenBody = document.createElement('div');
        resumenBody.className = "card-body";
        
        const totalRow = document.createElement('div');
        totalRow.className = "d-flex justify-content-between align-items-center mb-3";
        
        const totalLabel = document.createElement('h5');
        totalLabel.className = "fw-bold mb-0";
        totalLabel.textContent = "Total:";
        
        const totalValue = document.createElement('h5');
        totalValue.className = "fw-bold mb-0";
        totalValue.textContent = formatearPrecio(total);
        
        totalRow.appendChild(totalLabel);
        totalRow.appendChild(totalValue);
        
        const buttonsRow = document.createElement('div');
        buttonsRow.className = "d-flex justify-content-end mt-3";
        
        const btnVaciar = document.createElement('button');
        btnVaciar.id = "btn-vaciar-carrito";
        btnVaciar.className = "btn btn-outline-danger me-2";
        btnVaciar.textContent = "Vaciar carrito";
        
        const btnFinalizar = document.createElement('button');
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
        
        // Limpiar y añadir el contenido al contenedor
        carritoContainer.innerHTML = '';
        carritoContainer.appendChild(div_mostrar);
        
        // Agregar eventos a los botones
        const btnVaciarCarrito = document.getElementById('btn-vaciar-carrito');
        const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
        
        if (btnVaciarCarrito) {
            btnVaciarCarrito.addEventListener('click', vaciarCarrito);
        }
        
        if (btnFinalizarCompra) {
            btnFinalizarCompra.addEventListener('click', finalizarCompra);
        }
        
        // Agregar eventos a los botones de eliminar
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        botonesEliminar.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                eliminarProducto(id);
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
            // Obtener productos del localStorage
            const productos = JSON.parse(localStorage.getItem('productos'));
            
            // Devolver existencias a los productos originales
            carrito.forEach(item => {
                const productoOriginal = productos.find(prod => prod.id === item.id);
                if (productoOriginal) {
                    productoOriginal.cantidad += item.cantidad;
                }
            });
            
            // Guardar productos actualizados
            localStorage.setItem('productos', JSON.stringify(productos));
            
            // Limpiar carrito
            carrito = [];
            total = 0;
            localStorage.setItem('carrito', JSON.stringify(carrito));
            localStorage.setItem('totalCarrito', total.toString());
            
            // Actualizar vistas
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
        alert('¡Gracias por tu compra! Total: ' + formatearPrecio(total));
        
        // Limpiar carrito pero no devolver existencias a productos
        carrito = [];
        total = 0;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        localStorage.setItem('totalCarrito', total.toString());
        
        // Actualizar vistas
        actualizarContadorCarrito();
        actualizarVistaCarrito();
    }
});