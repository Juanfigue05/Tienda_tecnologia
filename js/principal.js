//si es primera vez que se carga la pagina
if (localStorage.getItem("primeraVez") === null) {
    localStorage.clear();
    localStorage.setItem("primeraVez", "true");
    console.log("Es la primera vez que se carga la página.");
}
//si no es la primera vez que se carga la pagina
else {
    console.log("No es la primera vez que se carga la página.");
    
}


const tarjetas = document.querySelectorAll(".card");

if (tarjetas.length > 0) {
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("click", function(evento) {
            const valor = tarjeta.getAttribute("data-value");
            if (valor) {
                console.log("Valor del div clickeado:", valor);
                localStorage.setItem("valorDiv_carta", valor);
            } else {
                console.log("El div no tiene un atributo 'data-value'.");
            }
        });
    });
} else {
    console.error("No se encontraron elementos con la clase 'card'.");
}