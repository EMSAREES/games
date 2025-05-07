// Obtener referencias a los elementos del DOM
const rulesBtn = document.getElementById("rules-btn"); // Botón para mostrar reglas
const closeBtn = document.getElementById("close-btn"); // Botón para cerrar reglas
const rules = document.getElementById("rules");        // Contenedor de reglas
const canvas = document.getElementById("canvas");      // Canvas para el juego
const ctx = canvas.getContext("2d");                   // Contexto para dibujar en el canvas

// Configurar tamaño del canvas
canvas.width = 800;
canvas.height = 600;

// Estado inicial del juego
let isPaused = false; // Se pone en true si pierdes (la bola cae)
let score = 0;        // Puntuación inicial

// Cantidad de filas y columnas de ladrillos
const brickRowCount = 5;
const brickColumnCount = 9;

// Propiedades de la bola
const ball = {
  x: canvas.width / 2,   // Posición inicial horizontal (centro)
  y: canvas.height / 2,  // Posición inicial vertical (centro)
  size: 10,              // Radio de la bola
  speed: 4,              // Velocidad base
  dx: 4,                 // Dirección horizontal (positiva hacia la derecha)
  dy: -4,                // Dirección vertical (negativa hacia arriba)
};

// Propiedades de la paleta
const paddle = {
  x: canvas.width / 2 - 40, // Posición inicial horizontal (centrada)
  y: canvas.height - 30,    // Posición vertical (cerca de la parte inferior)
  w: 80,                    // Ancho de la paleta
  h: 10,                    // Alto de la paleta
  speed: 8,                 // Velocidad al moverse
  dx: 0,                    // Dirección de movimiento (0 = estática)
};

// Configuración de los ladrillos
const brickInfo = {
  w: 70,           // Ancho
  h: 20,           // Alto
  padding: 10,     // Espacio entre ladrillos
  offsetX: 45,     // Margen izquierdo
  offsetY: 60,     // Margen superior
  visible: true,   // Estado inicial: visible
};

// Crear arreglo de ladrillos
const bricks = [];
for (let i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickRowCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Dibuja la bola
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2); // Círculo
  ctx.fillStyle = "#0095dd"; // Color
  ctx.fill();
  ctx.closePath();
}

// Dibuja la paleta
function drawPaddle() {
  ctx.fillStyle = "#0095dd";
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
}

// Dibuja el puntaje
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(`Score: ${score}`, canvas.width - 120, 30);
}

// Dibuja todos los ladrillos
function drawBricks() {
  bricks.forEach(column =>
    column.forEach(brick => {
      if (brick.visible) {
        ctx.fillStyle = "#0095dd";
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
      }
    })
  );
}

// Mueve la paleta con base en su dirección
function movePaddle() {
  paddle.x += paddle.dx;

  // Prevenir que la paleta se salga del canvas
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
}

// Mueve la bola y maneja colisiones
function moveBall() {
  if (isPaused) return; // No se mueve si el juego está en pausa

  ball.x += ball.dx;
  ball.y += ball.dy;

  // Rebote contra las paredes
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // Invertir dirección horizontal
  }
  if (ball.y - ball.size < 0) {
    ball.dy *= -1; // Rebote contra la parte superior
  }

  // Colisión con la paleta
  if (
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed; // Rebota hacia arriba
  }

  // Colisión con ladrillos
  bricks.forEach(column =>
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y - ball.size < brick.y + brick.h &&
          ball.y + ball.size > brick.y
        ) {
          ball.dy *= -1;       // Cambia dirección
          brick.visible = false; // Desaparece ladrillo
          increaseScore();     // Aumenta puntuación
        }
      }
    })
  );

  // Si la bola cae al fondo (pierdes)
  if (ball.y + ball.size > canvas.height) {
    isPaused = true;
    resetBall();      // Reiniciar bola
    showAllBricks();  // Mostrar todos los ladrillos
    score = 0;        // Reiniciar puntuación
  }
}

// Mostrar todos los ladrillos nuevamente
function showAllBricks() {
  bricks.forEach(column => column.forEach(brick => (brick.visible = true)));
}

// Reiniciar bola a su posición inicial
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 4;
  ball.dy = -4;
}

// Aumentar puntuación
function increaseScore() {
  score++;

  // Si destruiste todos los ladrillos, los vuelve a mostrar
  if (score % (brickRowCount * brickColumnCount) === 0) {
    showAllBricks();
  }
}

// Dibujar todos los elementos del juego
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// Función principal que actualiza todo
function update() {
  movePaddle();
  moveBall();
  draw();
  requestAnimationFrame(update); // Llama de nuevo a la función para animar
}

// Manejo de teclado
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
    isPaused = false; // Reanudar si estaba pausado
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
    isPaused = false;
  }
}

function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0; // Detener la paleta
  }
}

// Mostrar y ocultar reglas del juego
rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));

// Escuchar eventos del teclado
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Iniciar el juego
update();
