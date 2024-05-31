const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverDiv = document.getElementById('gameOver');
const finalScoreSpan = document.getElementById('finalScore');
const retryButton = document.getElementById('retryButton');

const birdImage = new Image();
birdImage.src = './bird.png';

const pipeTopImage = new Image();
pipeTopImage.src = './toppipe.png';

const pipeBottomImage = new Image();
pipeBottomImage.src = './pipe.png';

const bird = {
  x: 50,
  y: 150,
  width: 34,
  height: 24,
  gravity: 0.25,
  lift: -6,
  velocity: 0
};

const pipes = [];
const pipeWidth = 52;
const pipeGap = 120;
let frameCount = 0;
let score = 0;
let gameRunning = true;

document.addEventListener('keydown', () => {
  if (gameRunning) {
    bird.velocity = bird.lift;
  }
});

retryButton.addEventListener('click', () => {
  gameOverDiv.classList.add('hidden');
  resetGame();
});

function drawBird() {
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.velocity *= 0.9; // Add some smoothness to the movement
  bird.y += bird.velocity;
  
  if (bird.y + bird.height > canvas.height) {
    bird.y = canvas.height - bird.height;
    bird.velocity = 0;
    endGame();
  }

  if (bird.y < 0) {
    bird.y = 0;
    bird.velocity = 0;
  }
}

function createPipe() {
  const topHeight = Math.floor(Math.random() * (canvas.height / 2));
  pipes.push({
    x: canvas.width,
    y: 0,
    width: pipeWidth,
    height: topHeight
  });
  pipes.push({
    x: canvas.width,
    y: topHeight + pipeGap,
    width: pipeWidth,
    height: canvas.height - topHeight - pipeGap
  });
}

function drawPipes() {
  pipes.forEach(pipe => {
    if (pipe.y === 0) {
      ctx.drawImage(pipeTopImage, pipe.x, pipe.y, pipe.width, pipe.height);
    } else {
      ctx.drawImage(pipeBottomImage, pipe.x, pipe.y, pipe.width, pipe.height);
    }
  });
}

function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 2;
  });

  if (pipes.length && pipes[0].x + pipeWidth < 0) {
    pipes.splice(0, 2);
    score++;
  }
}

function checkCollision() {
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      bird.y < pipe.y + pipe.height &&
      bird.y + bird.height > pipe.y
    ) {
      endGame();
    }
  }
}

function drawScore() {
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

function endGame() {
  gameRunning = false;
  finalScoreSpan.textContent = score;
  gameOverDiv.classList.remove('hidden');
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes.length = 0;
  frameCount = 0;
  score = 0;
  gameRunning = true;
  gameLoop();
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  frameCount++;
  if (frameCount % 90 === 0) {
    createPipe();
  }

  drawBird();
  updateBird();

  drawPipes();
  updatePipes();

  checkCollision();
  drawScore();

  requestAnimationFrame(gameLoop);
}

gameLoop();
