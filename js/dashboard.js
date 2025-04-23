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
});
boton_informe_ventas.addEventListener("click", function() {
    ingresar_inventario.style.display = "none";
    consultar_inventario.style.display = "none";
    informe_ventas.style.display = "block";
});