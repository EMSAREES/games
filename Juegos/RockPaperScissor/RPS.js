const result_ref = document.getElementById("result");
const buttons = document.querySelectorAll('button');

let img_you = document.getElementById("picture_you");
let img_computer = document.getElementById("picture_computer");


document.getElementById("weapons").addEventListener("click", function(event) {
    const button = event.target.closest("button");
    if (button) {

        let valueGame = button.value;
        const userDiv = document.getElementById(valueGame);
        userDiv.style.backgroundColor = '#1ec1b2'; // usuario

        // Deshabilitar todos los botones
        buttons.forEach(btn => btn.disabled = true);

        // Ejecutar juego y obtener el div de la computadora
        const computerDiv = game(valueGame);

        // Pasar ambos divs a resetbutton
        // resetbutton([userDiv, computerDiv]);

        showImage(img_you, valueGame);
}


    // Deshabilitar todos los botones
    buttons.forEach(button => {
        button.disabled = true;
    });
});


let computer_score = 0;
let user_score = 0;
let Games_played = 0;

let choices_object = {
    'rock' : {
        'rock' : 'draw',
        'scissors' : 'win',
        'paper' : 'lose'
    },
    'scissors' : {
        'rock' : 'lose',
        'scissor' : 'draw',
        'paper' : 'win'
    },
    'paper' : {
        'rock' : 'win',
        'scissors' : 'lose',
        'paper' : 'draw'
    }

}

//===================================
// Iincio del juego
//===================================
function game(input) {
    let computer_choice = Math.floor(Math.random() * 3);
    let computer_choice_string = ['rock', 'scissors', 'paper'][computer_choice];

    // Get the div for the computer choice
    const div = document.getElementById(computer_choice_string);
    
    // Check if div exists before attempting to modify it
    if (div) {
        if (input === computer_choice_string) {
            div.style.background = 'linear-gradient(to right, #1ec1b2 50%, #57b019 50%)'; // Empate
        } else {
            div.style.backgroundColor = '#57b019'; // Computadora
        }

        // Now pass both divs to resetbutton
        resetbutton([div, document.getElementById(input)]); // Pass the user div as well
    }

    showImage(img_computer, computer_choice_string);

    if (choices_object[input][computer_choice_string] === 'win') {
        user_score++;
        document.getElementById("user_score").innerHTML = user_score;
        result_ref.innerHTML = `You win! ${input} beats ${computer_choice_string}`;
        document.getElementById("result").style.color = "#0cff00";
    } else if (choices_object[input][computer_choice_string] === 'lose') {
        computer_score++;
        document.getElementById("computer_score").innerHTML = computer_score;
        result_ref.innerHTML = `You lose! ${computer_choice_string} beats ${input}`;
        document.getElementById("result").style.color = "#f70909";
    } else {
        result_ref.innerHTML = "It's a draw!";
        document.getElementById("result").style.color = "black";
    }

    document.getElementById("Games_playeds").innerHTML = ++Games_played;

    // setTimeout(() => {
    //     img_you.innerHTML = ""; // Limpiar imagen del usuario
    //     img_computer.innerHTML = ""; // Limpiar imagen de la computadora
    //     // Solo vaciar el resultado
    //     result_ref.innerHTML = "";
    //     document.getElementById("result").style.color

    // }, 4000); // Esperar 2 segundos antes de limpiar las imágenes
}


//===================================
// mostrar imagen
//===================================
function showImage(divElement, imagePath) {
    // Limpiar el contenido anterior
    divElement.innerHTML = "";

    // Crear la imagen
    let img = document.createElement("img");

    switch (imagePath) {
        case 'rock':
            img.src = "/Juegos/RockPaperScissor/img/rock.png";
            img.alt = 'Imagen de piedra';
            break;
        case 'scissors':
            img.src = "/Juegos/RockPaperScissor/img/scissor.png";
            img.alt = 'Imagen de tijeras';
            break;
        case 'paper':
            img.src = "/Juegos/RockPaperScissor/img/paper.png";
            img.alt = 'Imagen de papel';
            break;
        default:
            console.error("Opción inválida:", imagePath);
            return;
    }

    // Añadir la imagen al div indicado
    divElement.appendChild(img);
}

//===================================
// reiniciar boton
//===================================

function resetbutton(divsToReset) {
    setTimeout(() => {
        buttons.forEach(button => button.disabled = false);
            
        divsToReset.forEach(div => {
            div.style.backgroundColor = '#FFBD0A';   // color base
            div.style.background = '';               // eliminar gradiente si hubo empate
        });

    },2000);

}


//===================================
// resetear score
//===================================
document.getElementById("scores_reset").addEventListener("click", function(){
    computer_score = 0;
    user_score = 0;
    Games_played = 0;
    document.getElementById("computer_score").innerHTML = computer_score;
    document.getElementById("user_score").innerHTML = user_score;
    document.getElementById("Games_playeds").innerHTML = Games_played;

    img_you.innerHTML = ""; // Limpiar imagen del usuario
    img_computer.innerHTML = ""; // Limpiar imagen de la computadora

    // Solo vaciar el resultado
    result_ref.innerHTML = "";
    document.getElementById("result").style.color
});

