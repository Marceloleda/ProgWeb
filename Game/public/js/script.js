(function () {
  let FPS = 300;
  const HEIGHT = 300;
  const WIDTH = 1024;
  const PROB_NUVEM = 1;

  let gameLoop;
  let deserto;
  let dino;
  let nuvens = [];
  let frame = 0;
  let gameStarted = false;
  let score = 0;
  let isDay = true;
  let paused = false;

  const SCORE_INCREMENT = 1;
  const FRAMES_PER_SCORE = 30;
  const DAY_NIGHT_INTERVAL = 60000;

  const scoreElement = document.createElement("div");
  scoreElement.className = "score";
  scoreElement.innerText = "0";
  document.getElementById("game").appendChild(scoreElement);

  function init() {
    gameLoop = setInterval(run, 1000 / FPS);
    deserto = new Deserto();
    dino = new Dino();

    setInterval(toggleDayNight, DAY_NIGHT_INTERVAL);

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" && !gameStarted) {
        gameStarted = true;
        score = 0;
        updateScore();
      }
    });

    setInterval(criarObstaculoAleatorio, 2000);
  }

  let obstaculos = [];

  function criarObstaculoAleatorio() {
    const randomNum = Math.random();
    let novoObstaculo;

    if (randomNum < 0.5) {
      novoObstaculo = new Cacto();
    } else {
      const alturaAleatoria = [10, 50, 80][Math.floor(Math.random() * 3)];
      novoObstaculo = new Pterossauro(alturaAleatoria);
    }

    obstaculos.push(novoObstaculo);
  }

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      if (dino.status === 0) dino.status = 1;
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyP" && gameStarted) {
      paused = !paused; 
    }
  });

  class Pterossauro {
    constructor(altura) {
      this.backgroundPositionsX = {
        pterossauro: "-195px",
        pterossauro2: "-264px"

      };
      this.element = document.createElement("div");
      this.element.className = "pterossauro";
      this.element.style.backgroundPositionX = this.backgroundPositionsX.pterossauro;
      this.element.style.left = `${WIDTH}px`;
      this.element.style.bottom = `${altura}px`;
      deserto.element.appendChild(this.element);
    }
    
  
    mover() {
      const currentLeft = parseInt(this.element.style.left);
      if (currentLeft < -100) {
        this.element.remove();
        obstaculos.shift();
      } else {
        this.element.style.left = `${currentLeft - 1}px`;
      }
    }
  }
  

  class Cacto {
    constructor() {
      this.backgroundPositionsX = {
        cacto: "-562px"
      };
      this.element = document.createElement("div");
      this.element.className = "cacto";
      this.element.style.backgroundPositionX = this.backgroundPositionsX.cacto;

      this.element.style.left = `${WIDTH}px`;
            
      deserto.element.appendChild(this.element);
    }
  
    mover() {
      const currentRight = parseInt(this.element.style.left);
      if (currentRight < -100) {
        this.element.remove();
        obstaculos.shift();
      } else {
        this.element.style.left = `${currentRight - 1}px`; 
      }
    }
  }

  class Deserto {
    constructor() {
      this.element = document.createElement("div");
      this.element.className = "deserto";
      this.element.style.width = `${WIDTH}px`;
      this.element.style.height = `${HEIGHT}px`;
      document.getElementById("game").appendChild(this.element);

      this.chao = document.createElement("div");
      this.chao.className = "chao";
      this.chao.style.backgroundPositionX = 0;
      this.element.appendChild(this.chao);
    }
    mover() {
      this.chao.style.backgroundPositionX = `${parseInt(this.chao.style.backgroundPositionX) - 1}px`;
    }
  }

  class Dino {
    #status;
    constructor() {
      this.backgroundPositionsX = {
        correndo1: "-1391px",
        correndo2: "-1457px",
        pulando: "-1259px",
      };
      this.#status = 0; // 0-correndo, 1-subindo, 2-descendo
      this.alturaMinima = 2;
      this.alturaMaxima = 150;
      this.element = document.createElement("div");
      this.element.className = "dino";
      this.element.style.backgroundPositionX = this.backgroundPositionsX.correndo1;
      this.element.style.backgroundPositionY = "-2px";
      this.element.style.bottom = `${this.alturaMinima}px`;
      deserto.element.appendChild(this.element);
    }
    /**
     * @param {number} value
     */
    set status(value) {
      if (value >= 0 && value <= 2) this.#status = value;
    }
    get status() {
      return this.#status;
    }
    correr() {
      if (this.#status === 0 && frame % 20 === 0)
        this.element.style.backgroundPositionX =
          this.element.style.backgroundPositionX === this.backgroundPositionsX.correndo1
            ? this.backgroundPositionsX.correndo2
            : this.backgroundPositionsX.correndo1;
      else if (this.#status === 1) {
        this.element.style.backgroundPositionX = this.backgroundPositionsX.pulando;
        this.element.style.bottom = `${parseInt(this.element.style.bottom) + 1}px`;
        if (parseInt(this.element.style.bottom) >= this.alturaMaxima) this.status = 2;
      } else if (this.#status === 2) {
        this.element.style.bottom = `${parseInt(this.element.style.bottom) - 1}px`;
        if (parseInt(this.element.style.bottom) <= this.alturaMinima) this.status = 0;
      }
    }
  }

  class Nuvem {
    constructor() {
      this.element = document.createElement("div");
      this.element.className = "nuvem";
      this.element.style.right = 0;
      this.element.style.top = `${parseInt(Math.random() * 200)}px`;
      deserto.element.appendChild(this.element);
    }
    mover() {
      this.element.style.right = `${parseInt(this.element.style.right) + 1}px`;
    }
  }

  function increaseGameSpeed() {
    FPS += 50;
    clearInterval(gameLoop);
    gameLoop = setInterval(run, 1000 / FPS);
  }

  setInterval(increaseGameSpeed, 60000);

  function toggleDayNight() {
    isDay = !isDay;

    const desertoElement = document.querySelector(".deserto");
    desertoElement.style.backgroundColor = isDay ? "#c0c0c0" : "#000";
  }

  function updateScore() {
    scoreElement.innerText = `${score}`;
  }
  function checkCollision() {
    const dinoRect = dino.element.getBoundingClientRect();
  
    for (const obstaculo of obstaculos) {
      const obstaculoRect = obstaculo.element.getBoundingClientRect();
  
      if (
        dinoRect.right > obstaculoRect.left &&
        dinoRect.left < obstaculoRect.right &&
        dinoRect.bottom > obstaculoRect.top
      ) {
        gameOver();
        break; 
      }
    }
  }
  function gameOver() {
    clearInterval(gameLoop);
    
    const gameOverMessage = document.createElement("div");
    gameOverMessage.className = "game-over";
    gameOverMessage.innerText = "Game Over";
    document.getElementById("game").appendChild(gameOverMessage);
  
    const restartButton = document.createElement("button");
    restartButton.className = "restart-button";
    restartButton.innerText = "Restart";
    restartButton.addEventListener("click", restartGame);
    document.getElementById("game").appendChild(restartButton);
  }

  function restartGame() {
    const gameOverMessage = document.querySelector(".game-over");
    const restartButton = document.querySelector(".restart-button");
    gameOverMessage.remove();
    restartButton.remove();
  
    obstaculos.forEach((obstaculo) => {
      obstaculo.element.remove();
    });
    obstaculos = [];
  
    dino.status = 0;
    score = 0;
    updateScore();
    frame = 0;
  
    gameLoop = setInterval(run, 1000 / FPS);

  }

  function run() {
    if (!gameStarted) return;
    if (paused) {
      return;
    }

    frame = frame + 1;
    if (frame === FPS) frame = 0;
    deserto.mover();
    dino.correr();
    if (Math.random() * 100 <= PROB_NUVEM) nuvens.push(new Nuvem());
    if (frame % 2 === 0) nuvens.forEach((nuvem) => nuvem.mover());

    if (frame >= FRAMES_PER_SCORE) {
      score += SCORE_INCREMENT;
      updateScore();
      frame = 0;
    }
    checkCollision();

    obstaculos.forEach((obstaculo) => {
      obstaculo.mover();
    });

    obstaculos.forEach((obstaculo, index) => {
      const currentRight = parseInt(obstaculo.element.style.right);
      if (currentRight < -100) {
        obstaculo.element.remove();
        obstaculos.splice(index, 1);
      }
    });
  }

  init();
})();