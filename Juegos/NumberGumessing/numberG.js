const entradaEl = document.querySelector("input");
const adivinanzaEl = document.querySelector(".guess");
const botonComprobarEl = document.querySelector("button");
const textoOportunidadesRestantesEl = document.querySelector(".chances");
const oportunidadesRestantesEl = document.querySelector(".chances");
const numero = document.querySelector(".numero");

let numeroAleatorio = Math.floor(Math.random() * 100);
let totalOportunidades = 10;

//numero.textContent = numeroAleatorio

botonComprobarEl.addEventListener("click", () => {


    if (botonComprobarEl.textContent === "Inicia de nuevo...") {
       
        numeroAleatorio = Math.floor(Math.random() * 100);
        totalOportunidades = 10;
        entradaEl.value = "";
        entradaEl.disabled = false;
        adivinanzaEl.textContent = "Haz tu adivinanza";
        adivinanzaEl.style.color = "#000";
        botonComprobarEl.textContent = "Comprobar";
        oportunidadesRestantesEl.textContent = totalOportunidades;
        textoOportunidadesRestantesEl.textContent = totalOportunidades;
    }else if (botonComprobarEl.textContent === "Jugar de nuevo") {
       
        numeroAleatorio = Math.floor(Math.random() * 100);
        totalOportunidades = 10;
        entradaEl.value = "";
        entradaEl.disabled = false;
        adivinanzaEl.textContent = "Haz tu adivinanza";
        adivinanzaEl.style.color = "#000";
        botonComprobarEl.textContent = "Comprobar";
        oportunidadesRestantesEl.textContent = totalOportunidades;
        textoOportunidadesRestantesEl.textContent = totalOportunidades;
    } else {
        totalOportunidades--;
        let valorEntrada = parseInt(entradaEl.value);

        if (totalOportunidades === 0) {
            entradaEl.value = "";
            entradaEl.disabled = true;
            adivinanzaEl.textContent = "Oops...! Mala suerte, perdiste el juego";
            adivinanzaEl.style.color = "red";
            botonComprobarEl.textContent = "Inicia de nuevo...";
            oportunidadesRestantesEl.textContent = "No quedan oportunidades";
        }
        else if (valorEntrada > numeroAleatorio) {
            adivinanzaEl.textContent = "Tu número es muy alto.";
            oportunidadesRestantesEl.textContent = totalOportunidades;
            adivinanzaEl.style.color = "#1446a0";
        }
        else if (valorEntrada < numeroAleatorio) {
            adivinanzaEl.textContent = "Tu número es muy bajo.";
            textoOportunidadesRestantesEl.textContent = totalOportunidades;
            adivinanzaEl.style.color = "#1446a0";
        }
        else if (valorEntrada === numeroAleatorio) {
            adivinanzaEl.textContent = "¡Felicidades! Has adivinado el número.";
            entradaEl.disabled = true;
            adivinanzaEl.style.color = "green";
            botonComprobarEl.textContent = "Jugar de nuevo";
        }
        else {
            adivinanzaEl.textContent = "Tu entrada es inválida.";
            oportunidadesRestantesEl.textContent = totalOportunidades;
            adivinanzaEl.style.color = "red";
        }
    }
});
