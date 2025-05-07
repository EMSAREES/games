//===================================
// Configuracion 
//===================================

// Iniciar el juego al presionar la barra espaciadora
document.addEventListener('keydown', changeDirection);

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 14; // Tamaño de cada cuadro de la serpiente y la comida   

let snake = [{x: 8 * box, y: 7 * box}]; // Posicion inicial de la serpiente
let direction = null; // Direccion inicial de la serpiente

let food = null; // Inicialmente no hay comida
let score = 0; // Puntuacion inicial

let gamestar = true; // Variable para controlar el estado del juego
miPopup.style.display = 'block';
let gameover = false; // Variable para controlar el estado del juego

//somnidos
const eatSound = new Audio("/Juegos/snake/sounds/eat.mp3");
const hitSound = new Audio("/Juegos/snake/sounds/hit.mp3");
const direccion = new Audio("/Juegos/snake/sounds/direction.mp3");
const gameOverSound = new Audio("/Juegos/snake/sounds/gameover.mp3");

//===================================
// Configurar botones gameboy
//===================================
const startButton = document.getElementById("startButton");

const leftButton = document.getElementById("button_izquierda");
const rightButton = document.getElementById("button_derecha");
const upButton = document.getElementById("button_arriba");
const downButton = document.getElementById("button_abajo");

startButton.addEventListener("click", starGamer); // Iniciar el juego al hacer clic en el botón "Start"
leftButton.addEventListener("click", () => {
    if (direction !== "RIGHT") {
        direction = "LEFT"; // Cambiar dirección a la izquierda
        direccion.play(); // Reproducir sonido de dirección
    }
});
rightButton.addEventListener("click", () => { 
    if (direction !== "LEFT") {
        direction = "RIGHT"; // Cambiar dirección a la derecha
        direccion.play(); // Reproducir sonido de dirección
    }
});
upButton.addEventListener("click", () => {
    if (direction !== "DOWN") {
        direction = "UP"; // Cambiar dirección hacia arriba
        direccion.play(); // Reproducir sonido de dirección
    }
});
downButton.addEventListener("click", () => {
    if (direction !== "UP") {
        direction = "DOWN"; // Cambiar dirección hacia abajo
        direccion.play(); // Reproducir sonido de dirección
    }
});



//===================================
// Generar comida aleatoria
//===================================
function spawnFood() {
    let newFood;
    let isOnSnake;

    do {
        isOnSnake = false;
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };

        // Verifica que la nueva comida no esté en el cuerpo de la serpiente
        for (let i = 0; i < snake.length; i++) {
            if (newFood.x === snake[i].x && newFood.y === snake[i].y) {
                isOnSnake = true;
                break;
            }
        }

    } while (isOnSnake); // Si la comida está sobre la serpiente, repetir

    return newFood;
}


//===================================
// Controles del teclado
//===================================
function changeDirection(e) {
    const key = e.key;

    // Solo permitir cambios de dirección cuando el juego ha comenzado
    if (!gamestar) {
        if (key === "ArrowLeft" && direction !== "RIGHT") {
            direction = "LEFT";
            direccion.play();
        } else if (key === "ArrowUp" && direction !== "DOWN") {
            direction = "UP";
            direccion.play();
        } else if (key === "ArrowRight" && direction !== "LEFT") {
            direction = "RIGHT";
            direccion.play();
        } else if (key === "ArrowDown" && direction !== "UP") {
            direction = "DOWN";
            direccion.play();
        }
    }
    
    // Iniciar el juego con la barra espaciadora independientemente del estado
    if (key === " " ) {
        starGamer();
    }

    console.log("Direction: ", direction); // Debugging
}

//===================================
// codigo del pricipoal del juego
//===================================
let game = setInterval(draw, 150); // Intervalo de actualización del juego

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

    //===================================
    // dibujar serpiente
    //===================================
    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "green" : "lightgreen"; // Color de la cabeza y el cuerpo
        ctx.fillRect(snake[i].x, snake[i].y, box, box); // Dibujar cada parte de la serpiente
        ctx.strokeStyle = "darkgreen"; // Color del borde
        ctx.strokeRect(snake[i].x, snake[i].y, box, box); // Dibujar el borde
    }

    //===================================
    // dibujar comida
    //===================================
    if (food) {
        ctx.beginPath(); 
        ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2); 
        ctx.fillStyle = "red"; // Color de la comida
        ctx.fill();
    }

    //===================================
    // movimiento de la serpiente
    //===================================
    let headx = snake[0].x;
    let heady = snake[0].y;

    if (direction === "LEFT"){
        headx -= box ; 
        // console.log("headx: ", headx);
    }
    else if (direction === "UP"){
        heady -= box;
        // console.log("heady: ", heady);
    }
    else if (direction === "RIGHT"){ 
        headx += box ;
        // console.log("headx: ", headx);
    }
    else if (direction === "DOWN"){
        heady += box;
        // console.log("heady: ", heady);
    }
    else return; // Si no hay direccion, no mover la serpiente

    
   
    //===================================
    // colisiones
    //===================================
    if(headx < 0 || headx >= canvas.width || heady < 0 || heady >= canvas.height) {
        hitSound.play(); // Reproducir sonido de colisión
        endGame(); // Si la cabeza sale del canvas, termina el juego
    }

    // Comprobar si la cabeza de la serpiente choca con su propio cuerpo
    for (let i = 1; i < snake.length; i++) {
        if (headx === snake[i].x && heady === snake[i].y) {
            hitSound.play(); // Reproducir sonido de colisión
            endGame();
        }
    }

    //===================================
    // comer comida
    //===================================
    if (headx === food.x && heady === food.y) {
        eatSound.play(); // Reproducir sonido de comer
        score++; // Aumentar puntuación
        updateScore();  
        snake.push({}); // Agregar un nuevo segmento a la serpiente
        food = spawnFood(); // Generar nueva comida
    }


    const newHead = {x: headx, y: heady}; // Nueva cabeza de la serpiente
    snake.unshift(newHead); // Agregar la nueva cabeza al inicio de la serpiente
    snake.pop(); // Eliminar la cola de la serpiente
    
}


//===================================
// actualizar punto
//===================================
function updateScore() {
    document.getElementById('score').textContent = score;
}

//===================================
// star y game over
//===================================

function starGamer() {
    if (gamestar) {
        gamestar = false;
        miPopup.style.display = 'none';
        if (!food) {
            food = spawnFood();
        }
    }
    else if (gameover) {
        resetSnake(); // Reiniciar la lógica
        document.getElementById("gameOverPopup").style.display = "none";
        game = setInterval(draw, 150); // <- ¡Aquí reinicias el juego!
        gameOverSound.pause(); // Detener el sonido de game over
        gameOverSound.currentTime = 0; // Reiniciar el tiempo del sonido
    }
}


function endGame() {
    setTimeout(() => {
        clearInterval(game); // Detener el juego
        gameover = true; // Cambiar estado del juego a gameover
        gameOverSound.play(); // Reproducir sonido de game over
        document.getElementById("gameOverPopup").style.display = "block";
    }, 500); // Esperar un poco antes de mostrar el popup
}

//===================================
// resetiar snake
//===================================
function resetSnake() {
    snake = [{x: 8 * box, y: 7 * box}]; // Reiniciar la serpiente a su posición inicial
    direction = null; // Reiniciar la dirección
    food = spawnFood(); // Generar nueva comida
    score = 0; // Reiniciar puntuación
    gamestar = false; // El juego ya está iniciado
    gameover = false; // Cambiar estado del juego a no game over
    updateScore(); // Actualizar puntuación en el DOM
}