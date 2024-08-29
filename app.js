const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");

document.getElementById('left').addEventListener('touchstart', (e) => {
    e.preventDefault();  // Previene la selección de texto y otros comportamientos por defecto
    keys.ArrowLeft = true;
}, { passive: false });

document.getElementById('left').addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.ArrowLeft = false;
}, { passive: false });

document.getElementById('right').addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys.ArrowRight = true;
}, { passive: false });

document.getElementById('right').addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.ArrowRight = false;
}, { passive: false });

document.addEventListener("DOMContentLoaded", function() {
    const gameMusic = document.getElementById('gameMusic');
    const startScreen = document.querySelector(".startScreen");
    const endScreen = document.querySelector(".endScreen"); // Asume que tienes un fin de juego

    startScreen.addEventListener("click", function() {
        gameMusic.play();
    });

    // Suponiendo que tienes una manera de detectar el fin del juego
    //endScreen.addEventListener("click", function() {
      //  gameMusic.pause();
       // gameMusic.currentTime = 0; // Reinicia la canción al principio
    //});
});
let isMusicPlaying = true; // Variable para rastrear el estado de la música

function toggleMusic() {
    if (isMusicPlaying) {
        gameMusic.pause();
        document.querySelector('button[onclick="toggleMusic()"]').innerText = "Reactivar Música"; // Cambia el texto del botón
    } else {
        gameMusic.play();
        document.querySelector('button[onclick="toggleMusic()"]').innerText = "Silenciar Música";
    }
    isMusicPlaying = !isMusicPlaying; // Alterna el estado
}
document.addEventListener("DOMContentLoaded", () => {
    const leftButton = document.getElementById('left');
    const rightButton = document.getElementById('right');

    leftButton.addEventListener('touchstart', () => keys.ArrowLeft = true);
    leftButton.addEventListener('touchend', () => keys.ArrowLeft = false);

    rightButton.addEventListener('touchstart', () => keys.ArrowRight = true);
    rightButton.addEventListener('touchend', () => keys.ArrowRight = false);
});


let player = {
    speed: 5,
};

startScreen.addEventListener("click", startGame);

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

function triggerVibration(type) {
    if (navigator.vibrate) {
        if (type === 'collision') {
            // Vibración fuerte para colisiones
            window.navigator.vibrate([100,10,200,10,300,10,400]);
        } else if (type === 'limit') {
            // Vibración más continua pero tenue para límites de la pista
            window.navigator.vibrate([50,20,30,10,10]);
        }
    } else {
        console.log('Vibration API not supported.');
    }
}

function keyDown(e) {
    e.preventDefault();
    keys[e.key] = true;
}
function keyUp(e) {
    e.preventDefault();
    keys[e.key] = false;
}

function gamePlay() {
    let car = document.querySelector(".car");
    let road = gameArea.getBoundingClientRect();

    if (player.start) {
        moveLines();
        moveEnemyCar(car);

        if (keys.ArrowLeft && player.x > 0) {
            player.x -= player.speed;
            if (player.x < 0) { // Asegurarse de no ir más allá del borde izquierdo
                player.x = -5;
                triggerVibration('limit'); // Vibración continua si toca el borde
            }
        }
        if (keys.ArrowRight) {
            player.x += player.speed;
            if (player.x > road.width - car.offsetWidth) {
                player.x = road.width - car.offsetWidth-3;
                triggerVibration('limit'); // Vibración continua si toca el borde
            }
        }

        car.style.left = `${player.x}px`;
        window.requestAnimationFrame(gamePlay);

        player.score++;
        score.innerHTML = "Score: " + player.score;
    }
}

function moveLines() {
    let lines = document.querySelectorAll(".line");
    lines.forEach((line, index) => {
        if (line.y >= 700) {
            line.y -= 750;
        }
        line.y += player.speed;
        line.style.top = line.y + "px";
    });
}

function isCollide(car, enemyCar) {
    carRect = car.getBoundingClientRect();
    enemyCarRect = enemyCar.getBoundingClientRect();

    if (!(carRect.top > enemyCarRect.bottom ||
          carRect.left > enemyCarRect.right ||
          carRect.right < enemyCarRect.left ||
          carRect.bottom < enemyCarRect.top)) {
        triggerVibration('collision');  // Vibración breve en colisiones
        return true;
    }
    return false;
}

function moveEnemyCar(car) {
    let enemyCars = document.querySelectorAll(".enemyCar");
    enemyCars.forEach((enemyCar, index) => {
        if (isCollide(car, enemyCar)) {
            endGame();
        }

        if (enemyCar.y >= 750) {
            enemyCar.y = -300;
            enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
        }
        enemyCar.y += player.speed;
        enemyCar.style.top = enemyCar.y + "px";
    });
}

const gameMusic = document.getElementById('gameMusic');

function startGame() {
    score.classList.remove("hide");
    startScreen.classList.add("hide");
    gameArea.innerHTML = "";

    player.start = true;
    player.score = 0;
    window.requestAnimationFrame(gamePlay);

    for (let i = 0; i < 5; i++) {
        let roadLine = document.createElement("div");
        roadLine.setAttribute("class", "line");
        roadLine.y = i * 150;
        roadLine.style.top = roadLine.y + "px";
        gameArea.appendChild(roadLine);
    }

    let car = document.createElement("div");
    car.setAttribute("class", "car");
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    for (let i = 0; i < 3; i++) {
        let enemyCar = document.createElement("div");
        enemyCar.setAttribute("class", "enemyCar");
        enemyCar.y = (i + 1) * 350 * -1;
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.backgroundImage = `url("./images/car${i + 1}.png")`;
        enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
        gameArea.appendChild(enemyCar);
    }

    // Start or restart the music when the game starts
    gameMusic.play();
}

function endGame() {
    player.start = false;
    startScreen.classList.remove("hide");

    // Pause and reset the music when the game ends
    gameMusic.pause();
    gameMusic.currentTime = 0;
}
