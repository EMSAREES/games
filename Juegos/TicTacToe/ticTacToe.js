// =====================
// Obtener elementos del DOM
// =====================
const casillas = document.querySelectorAll('.casilla');
const status = document.getElementById('status');
const resetBtn = document.getElementById('reset');

// Estado del tablero de juego (9 espacios vacíos)
let estadoJuego = ['', '', '', '', '', '', '', '', ''];
let juegoTerminado = false; // Bandera para saber si el juego terminó
let esperandoIA = false;    // Bandera para evitar que el jugador juegue mientras responde la IA

// =====================
// Evento al hacer clic en una casilla
// =====================
casillas.forEach(casilla => {
    casilla.addEventListener('click', () => {
        const cell = parseInt(casilla.id);

        // Si la casilla está vacía, el juego no ha terminado y no estamos esperando a la IA
        if (estadoJuego[cell] === "" && !juegoTerminado && !esperandoIA) {
            estadoJuego[cell] = "X"; // El jugador marca con "X"
            casilla.classList.add('x');
            casilla.textContent = "X"; 
            status.textContent = 'Turno de la O';

            // Verificamos si el jugador ganó
            let resultado = checkwinner(estadoJuego);
            if (resultado) return endGame(resultado);

            // Bloqueamos input del jugador mientras responde la IA
            esperandoIA = true;

            // Esperar 2 segundos antes de que juegue la IA
            setTimeout(() => {
                const move = minimax(estadoJuego, true);

                if (move.index !== undefined) {
                    estadoJuego[move.index] = "O"; // IA marca con "O"
                    const botCell = document.getElementById(move.index.toString());
                    botCell.classList.add('o');
                    botCell.textContent = "O";
                }

                // Verificar si la IA ganó o hubo empate
                resultado = checkwinner(estadoJuego);
                if (resultado) return endGame(resultado);
                else status.textContent = 'Tu turno X';

                // Permitir que el jugador vuelva a jugar
                esperandoIA = false;

            }, 1000); // 2000 milisegundos = 2 segundos
        }
    });
});

// =====================
// Función que verifica si alguien ganó o si hubo empate
// =====================
function checkwinner(tablero) {
    const combinacionesGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];

    for (let [a, b, c] of combinacionesGanadoras) {
        if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
            return tablero[a]; // Devuelve "X" o "O" si alguien ganó
        }
    }

    // Si todas las casillas están llenas y no hay ganador, es empate
    if (tablero.every(c => c !== '')) return 'tie';

    return null; // No hay ganador ni empate aún
}

// =====================
// Algoritmo Minimax para que la IA juegue inteligentemente
// =====================
function minimax(tablero, isMax) {
    const resultado = checkwinner(tablero);

    if (resultado === 'O') return { score: 1 };
    if (resultado === 'X') return { score: -1 };
    if (resultado === 'tie') return { score: 0 };

    let bestMove;

    if (isMax) {
        let bestScore = -Infinity;
        tablero.forEach((val, i) => {
            if (val === '') {
                tablero[i] = 'O';
                const score = minimax(tablero, false).score;
                tablero[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        });
        return { score: bestScore, index: bestMove };
    } else {
        let bestScore = Infinity;
        tablero.forEach((val, i) => {
            if (val === '') {
                tablero[i] = 'X';
                const score = minimax(tablero, true).score;
                tablero[i] = '';
                if (score < bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        });
        return { score: bestScore, index: bestMove };
    }
}

// =====================
// Mostrar el resultado del juego
// =====================
function endGame(resultado) {
    juegoTerminado = true;

    if (resultado === 'tie') {
        status.textContent = '¡Empate!';
    } else if (resultado === 'X') {
        status.textContent = '¡Ganaste!';
    } else {
        status.textContent = '¡Perdiste!';
    }
}

// =====================
// Reiniciar el juego
// =====================
resetBtn.addEventListener('click', () => {
    estadoJuego = ['', '', '', '', '', '', '', '', '']; // Vaciar el tablero
    juegoTerminado = false;
    esperandoIA = false;
    casillas.forEach(casilla => {
        casilla.innerHTML = ''; // Limpiar texto de cada casilla
        casilla.classList.remove('x', 'o'); // Remover clases de jugador e IA
    });
    status.textContent = '¡Turno de Jugador X!'; // Mensaje inicial
});
