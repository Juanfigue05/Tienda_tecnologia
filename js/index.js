const btn_producto= document.getElementById("boton_productos");

btn_producto.addEventListener("click",()=>{
    let valor="";
    console.log("Valor del div clickeado:", valor);
    localStorage.setItem("valorDiv_carta", valor);
})

const tarjetas = document.querySelectorAll(".card");

if (tarjetas.length > 0) {
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("click", function(evento) {
            const valor = tarjeta.getAttribute("data-value");
            if (valor) {
                console.log("Valor del div clickeado:", valor);
                localStorage.setItem("valorDiv_carta", valor);
                // Redirigir a otra página
                window.location.href = "productos.html";
            } else {
                console.log("El div no tiene un atributo 'data-value'.");
            }
        });
    });
} else {
    console.error("No se encontraron elementos con la clase 'card'.");
}

