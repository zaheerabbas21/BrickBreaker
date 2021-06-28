const canvas = document.getElementById("game");
const canvasContext = canvas.getContext("2d");

canvas.style.border = "1px solid #0ff";

canvasContext.lineWidth = 2;

// GAME VARIABLES AND CONSTANTS
let PADDLE_WIDTH = 120;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 40;
let BALL_RADIUS = 15;
const POWER_UP_RADIUS = 30;

let isPaused = true;

let LIFE = 3; // PLAYER HAS 3 LIVES
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 5;

let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;

const BG_IMG = new Image();
BG_IMG.src = "img/bg.jpg";

const LEVEL_IMG = new Image();
LEVEL_IMG.src = "img/level.png";

const LIFE_IMG = new Image();
LIFE_IMG.src = "img/life.png";

const SCORE_IMG = new Image();
SCORE_IMG.src = "img/score.png";

const PAUSE_IMG = new Image();
PAUSE_IMG.src = "img/pause.svg";

const strongBrickImage = new Image();
strongBrickImage.src = "img/strength3.png";

const midBrickImage = new Image();
midBrickImage.src = "img/strength2.png";

const normalBrickImage = new Image();
normalBrickImage.src = "img/strength1.png";

const WALL_HIT = new Audio();
WALL_HIT.src = "sounds/wall.mp3";

const LIFE_LOST = new Audio();
LIFE_LOST.src = "sounds/life_lost.mp3";

const PADDLE_HIT = new Audio();
PADDLE_HIT.src = "sounds/paddle_hit.mp3";

const WIN = new Audio();
WIN.src = "sounds/win.mp3";

const BRICK_HIT = new Audio();
BRICK_HIT.src = "sounds/brick_hit.mp3";

const GAME_SONG = new Audio();
GAME_SONG.src = "sounds/gameOn.mp3";

let paddle = {
  x: canvas.width / 2 - PADDLE_WIDTH / 2,
  y: canvas.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dx: 5,
};

let ball = {
  x: canvas.width / 2 - BALL_RADIUS / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 6,
  dx: 3,
  dy: -3,
};

let powerUp1 = {
  x: canvas.width / 4 - POWER_UP_RADIUS / 2,
  y: paddle.y - canvas.width / 4,
  radius: POWER_UP_RADIUS,
  speed: 1,
  dx: 0,
  dy: 1,
};

let powerUp2 = {
  x: (5 * canvas.width) / 6 - POWER_UP_RADIUS / 2,
  y: paddle.y - canvas.width / 4,
  radius: 30,
  speed: 1,
  dx: 0,
  dy: 1,
};

function drawPowerUp1() {
  const ballImage = new Image();
  ballImage.src = "./img/powerUp1.png";
  canvasContext.drawImage(
    ballImage,
    powerUp1.x,
    powerUp1.y,
    powerUp1.radius,
    powerUp1.radius
  );
}

function drawPowerUp2() {
  const ballImage = new Image();
  ballImage.src = "./img/ball.png";
  canvasContext.drawImage(
    ballImage,
    powerUp2.x,
    powerUp2.y,
    powerUp2.radius,
    powerUp2.radius
  );
}

function movePowerUp1() {
  powerUp1.x += powerUp1.dx;
  powerUp1.y += powerUp1.dy;
}

function movePowerUp2() {
  powerUp2.x += powerUp2.dx;
  powerUp2.y += powerUp2.dy;
}

// DRAW THE BALL
function drawBall() {
  const ballImage = new Image();
  ballImage.src = "./img/ball.png";
  canvasContext.drawImage(ballImage, ball.x, ball.y, ball.radius, ball.radius);
}

// MOVE THE BALL
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function drawPaddle() {
  const paddleImage = new Image();
  paddleImage.src = "./img/paddle.png";
  canvasContext.drawImage(
    paddleImage,
    paddle.x,
    paddle.y,
    paddle.width,
    paddle.height
  );
} // end draw

function movePaddle() {
  if (rightArrow && paddle.x + paddle.width < canvas.width) {
    paddle.x += paddle.dx;
  } else if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
}

// BALL AND WALL COLLISION DETECTION
function ballWallCollision() {
  if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
    ball.dx = -ball.dx;
    WALL_HIT.play();
  }

  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
    WALL_HIT.play();
  }

  if (ball.y + ball.radius >= canvas.height - PADDLE_MARGIN_BOTTOM) {
    LIFE--; // LOSE LIFE
    LIFE_LOST.play();
    resetGame();
    // setTimeout(resetGame, 500);
  }
}

// BALL AND PADDLE COLLISION
function ballPaddleCollision() {
  if (
    ball.x < paddle.x + paddle.width &&
    ball.x > paddle.x &&
    paddle.y < paddle.y + paddle.height &&
    ball.y > paddle.y
  ) {
    PADDLE_HIT.play();

    // CHECK WHERE THE BALL HIT THE PADDLE
    let collidePoint = ball.x - (paddle.x + paddle.width / 2);

    // NORMALIZE THE VALUES
    collidePoint = collidePoint / (paddle.width / 2);

    // CALCULATE THE ANGLE OF THE BALL
    let angle = (collidePoint * Math.PI) / 3;

    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
}

// POWERUP1 AND PADDLE COLLISION
function powerUp1Collision() {
  if (powerUp1.y > paddle.y + paddle.height) {
    powerUp1.x = -1111100;
    powerUp1.y = -11111100;
  } else if (
    powerUp1.x < paddle.x + paddle.width &&
    powerUp1.x > paddle.x &&
    paddle.y < paddle.y + paddle.height &&
    powerUp1.y > paddle.y
  ) {
    PADDLE_HIT.play();

    // CHECK WHERE THE BALL HIT THE PADDLE
    let collidePoint = powerUp1.x - (paddle.x + paddle.width / 2);

    // NORMALIZE THE VALUES
    collidePoint = collidePoint / (paddle.width / 2);

    // CALCULATE THE ANGLE OF THE BALL
    let angle = (collidePoint * Math.PI) / 3;

    PADDLE_WIDTH = 180;
    paddle.width = 180;
    powerUp1.x = -1111000;
    powerUp1.y = -1111000;
    powerUp1.dx = 0;
    powerUp1.dy = 0;

    setTimeout(() => {
      PADDLE_WIDTH = 120;
      paddle.width = 120;
    }, 5000);
  }
}

// POWERUP2 AND PADDLE COLLISION
function powerUp2Collision() {
  if (powerUp2.y > paddle.y + paddle.height) {
    powerUp2.x = -1111100;
    powerUp2.y = -11111100;
  } else if (
    powerUp2.x < paddle.x + paddle.width &&
    powerUp2.x > paddle.x &&
    paddle.y < paddle.y + paddle.height &&
    powerUp2.y > paddle.y
  ) {
    PADDLE_HIT.play();

    // CHECK WHERE THE BALL HIT THE PADDLE
    let collidePoint = powerUp1.x - (paddle.x + paddle.width / 2);

    // NORMALIZE THE VALUES
    collidePoint = collidePoint / (paddle.width / 2);

    // CALCULATE THE ANGLE OF THE BALL
    let angle = (collidePoint * Math.PI) / 3;

    BALL_RADIUS = 25;
    ball.radius = 25;
    powerUp2.x = -11100;
    powerUp2.y = -111100;
    powerUp2.dx = 0;
    powerUp2.dy = 0;

    console.log(BALL_RADIUS);

    setTimeout(() => {
      BALL_RADIUS = 15;
      ball.radius = 15;
    }, 5000);
  }
}

// RESET THE BALL
function resetGame() {
  isPaused = true;
  ball.x = canvas.width / 2 - BALL_RADIUS / 2;
  ball.y = paddle.y - BALL_RADIUS;
  ball.dx = 3;
  ball.dy = -3;
  paddle = {
    x: canvas.width / 2 - PADDLE_WIDTH / 2,
    y: canvas.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 5,
  };
}

// CREATE THE BRICKS
const brick = {
  row: LEVEL,
  column: 5,
  width: 55,
  height: 20,
  offSetLeft: 40,
  offSetTop: 20,
  marginTop: 50,
};

const strongBrick = {
  img: strongBrickImage,
  strength: 3,
};

const midStrongBrick = {
  img: midBrickImage,
  strength: 2,
};

const normalBrick = {
  img: normalBrickImage,
  strength: 1,
};

let bricks = [];

const colors = [
  "#ffffff",
  "#ffffff",
  "#4CEFFF",
  "#029EFF",
  "#35A7B2",
  "#0E2F31",
];
//levels
const level1 = [
  [3, 3, 3, 3, 3],
  [1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
];

const level2 = [
  [3, 3, 3, 3, 3],
  [0, 2, 3, 2, 3],
  [0, 0, 1, 2, 3],
  [0, 0, 0, 1, 2],
  [0, 0, 0, 0, 1],
];
const level3 = [
  [0, 0, 1, 0, 0],
  [0, 1, 1, 1, 0],
  [1, 1, 2, 1, 1],
  [1, 2, 1, 2, 1],
  [3, 3, 2, 3, 2],
  [3, 0, 0, 0, 3],
];
const level4 = [
  [0, 0, 3, 0, 0],
  [0, 3, 2, 3, 0],
  [2, 3, 2, 3, 2],
  [3, 2, 1, 2, 3],
  [0, 3, 2, 3, 0],
  [0, 0, 3, 0, 0],
];
const level5 = [
  [3, 0, 0, 0, 3],
  [3, 0, 0, 0, 3],
  [3, 2, 0, 2, 3],
  [0, 2, 3, 2, 0],
  [0, 2, 2, 2, 0],
  [0, 0, 1, 0, 0],
  [3, 3, 3, 3, 3],
  [0, 2, 3, 2, 0],
  [0, 0, 2, 0, 0],
];

function getCurrentLevelMatrix() {
  switch (LEVEL) {
    case 1:
      return level1;
    case 2:
      return level2;
    case 3:
      return level3;
    case 4:
      return level4;
    case 5:
      return level5;
    default:
      return level1;
  }
}

function getCurrentBrickImage(num) {
  switch (num) {
    case 1:
      return normalBrick.img;
    case 2:
      return midStrongBrick.img;
    case 3:
      return strongBrick.img;
  }
}

function createBricks() {
  const levelMatrix = getCurrentLevelMatrix();

  for (let row = 0; row < levelMatrix.length; row++) {
    bricks[row] = [];
    for (let col = 0; col < levelMatrix[row].length; col++) {
      const currentBrickImage = getCurrentBrickImage(levelMatrix[row][col]);

      bricks[row][col] = {
        x: col * (brick.offSetLeft + brick.width) + brick.offSetLeft,
        y:
          row * (brick.offSetTop + brick.height) +
          brick.offSetTop +
          brick.marginTop,
        strength: levelMatrix[row][col],
        img: currentBrickImage,
      };
    }
  }
}

createBricks();

// draw the bricks
function drawBricks() {
  const levelMatrix = getCurrentLevelMatrix();

  for (let row = 0; row < levelMatrix.length; row++) {
    for (let col = 0; col < levelMatrix[row].length; col++) {
      let b = bricks[row][col];
      if (b.strength > 0) {
        canvasContext.drawImage(b.img, b.x, b.y, brick.width, brick.height);
      }
    }
  }
}

// ball brick collision
function ballBrickCollision() {
  const levelMatrix = getCurrentLevelMatrix();
  for (let r = 0; r < levelMatrix.length; r++) {
    for (let c = 0; c < levelMatrix[r].length; c++) {
      let b = bricks[r][c];
      // if the brick isn't broken
      if (b.strength) {
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + brick.width &&
          ball.y + ball.radius > b.y &&
          ball.y - ball.radius < b.y + brick.height
        ) {
          b.strength -= 1;
          b.img = getCurrentBrickImage(b.strength);
          if (b.strength <= 0) {
            BRICK_HIT.play();
            ball.dy = -ball.dy;
            b.status = false; // the brick is broken
            SCORE += SCORE_UNIT;
          } else {
            ball.dx = -ball.dx;
            ball.dy = -ball.dy;
          }
        }
      }
    }
  }
}

// show game stats
function showGameStats(text, textX, textY, img, imgX, imgY) {
  // draw text
  canvasContext.fillStyle = "#FFF";
  canvasContext.font = "20px 'Press Start 2P'";
  canvasContext.fillText(text, textX, textY);

  // draw image
  canvasContext.drawImage(img, imgX, imgY, (width = 25), (height = 25));
}

function levelUp() {
  let isLevelDone = true;
  const levelMatrix = getCurrentLevelMatrix();

  // check if all the bricks are broken
  for (let r = 0; r < levelMatrix.length; r++) {
    for (let c = 0; c < levelMatrix[r].length; c++) {
      isLevelDone = isLevelDone && !bricks[r][c].strength;
    }
  }

  if (isLevelDone) {
    WIN.play();

    if (LEVEL >= MAX_LEVEL) {
      showYouWin();
      GAME_OVER = true;
      return;
    }
    LEVEL += 1;
    createBricks();
    ball.speed += 0.5;
    resetGame();
  }
}

// game over
function gameOver() {
  if (LIFE <= 0) {
    showYouLose();
    GAME_OVER = true;
  }
}

function update() {
  movePaddle();
  moveBall();
  if (SCORE >= 150 && SCORE <= 200) movePowerUp2();
  else if (SCORE >= 75 && SCORE <= 125) movePowerUp1();
  ballWallCollision();
  ballPaddleCollision();
  ballBrickCollision();
  powerUp1Collision();
  powerUp2Collision();
  gameOver();
  levelUp();
  GAME_SONG.play();
}

function draw() {
  drawPaddle();
  drawBall();
  drawBricks();
  if (SCORE >= 150 && SCORE <= 200) drawPowerUp2();
  else if (SCORE >= 75 && SCORE <= 125) drawPowerUp1();
  showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
  showGameStats(LIFE, canvas.width - 25, 25, LIFE_IMG, canvas.width - 55, 5);
  showGameStats(
    LEVEL,
    canvas.width / 2,
    25,
    LEVEL_IMG,
    canvas.width / 2 - 30,
    5
  );
}

function loop() {
  // CLEAR THE CANVAS
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  draw();
  if (!isPaused) {
    update();
  }

  if (!GAME_OVER) {
    requestAnimationFrame(loop);
  }
}

loop();

const pauseBtn = document.getElementById("pause");
pauseBtn.addEventListener("click", () => {
  let imgSrc = pauseBtn.getAttribute("src");
  console.log(imgSrc);
  let PAUSE_IMG = imgSrc == "img/play.png" ? "img/pause.png" : "img/play.png";
  isPaused = !isPaused;
  pauseBtn.setAttribute("src", PAUSE_IMG);
});

// SELECT SOUND ELEMENT
const soundElement = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager() {
  // CHANGE IMAGE SOUND_ON/OFF
  let imgSrc = soundElement.getAttribute("src");
  let SOUND_IMG =
    imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";

  soundElement.setAttribute("src", SOUND_IMG);

  // MUTE AND UNMUTE SOUNDS
  WALL_HIT.muted = WALL_HIT.muted ? false : true;
  PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
  BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
  WIN.muted = WIN.muted ? false : true;
  LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
  GAME_SONG.muted = GAME_SONG.muted ? false : true;
}

// SHOW GAME OVER MESSAGE
/* SELECT ELEMENTS */
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwon");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function () {
  location.reload(); // reload the page
});

// SHOW YOU WIN
function showYouWin() {
  gameover.style.display = "block";
  youwin.style.display = "block";
}

// SHOW YOU LOSE
function showYouLose() {
  gameover.style.display = "block";
  youlose.style.display = "block";
}

// CONTROL THE PADDLE
document.addEventListener("keydown", function (event) {
  const keyCode = event.code;
  if (keyCode === "ArrowLeft" || keyCode === "KeyA") {
    leftArrow = true;
    isPaused = false;
  } else if (keyCode === "ArrowRight" || keyCode === "KeyD") {
    rightArrow = true;
    isPaused = false;
  }
});

document.addEventListener("keyup", function (event) {
  const keyCode = event.code;
  if (keyCode === "ArrowLeft" || keyCode === "KeyA") {
    leftArrow = false;
  } else if (keyCode === "ArrowRight" || keyCode === "KeyD") {
    rightArrow = false;
  }
});

// document.addEventListener("mousemove", function (event) {
//   if (event.clientX + paddle.width > 200 && event.clientX < canvas.width)
//     movePaddleWithMouse(event.clientX);
// });

// // MOVE PADDLE
// function movePaddleWithMouse(changeX) {
//   if (paddle.x >= 0 && paddle.x + paddle.width <= canvas.width) {
//     paddle.x = changeX - paddle.width;
//   } else if (paddle.x <= 0) {
//     paddle.x = 1;
//   } else if (paddle.x + paddle.width >= canvas.width) {
//     paddle.x = canvas.width - paddle.width;
//   }
// }
