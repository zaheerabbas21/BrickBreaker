const canvas = document.getElementById("game");
const canvasContext = canvas.getContext("2d");

canvas.style.border = "1px solid #0ff";

canvasContext.lineWidth = 2;

// GAME VARIABLES AND CONSTANTS
const PADDLE_WIDTH = 120;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 40;
const BALL_RADIUS = 15;

let isPaused = false;

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

let paddle = {
  x: canvas.width / 2 - PADDLE_WIDTH / 2,
  y: canvas.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dx: 5,
};

let ball = {
  x: canvas.width / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 6,
  dx: 3,
  dy: -3,
};

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
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
    // WALL_HIT.play();
  }

  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
    // WALL_HIT.play();
  }

  if (ball.y + ball.radius > canvas.height) {
    LIFE--; // LOSE LIFE
    // LIFE_LOST.play();
    setTimeout(resetGame, 1000);
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

// RESET THE BALL
function resetGame() {
  ball.x = canvas.width / 2;
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

let bricks = [];

const colors = [
  "#ffffff",
  "#ffffff",
  "#4CEFFF",
  "#029EFF",
  "#35A7B2",
  "#0E2F31",
];

function createBricks() {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
        y:
          r * (brick.offSetTop + brick.height) +
          brick.offSetTop +
          brick.marginTop,
        status: true,
        strength: LEVEL,
        fillColor: colors[LEVEL],
        strokeColor: "white",
      };
    }
  }
}

createBricks();

// draw the bricks
function drawBricks() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      // if the brick isn't broken
      if (b.status) {
        canvasContext.fillStyle = b.fillColor;
        canvasContext.fillRect(b.x, b.y, brick.width, brick.height);

        canvasContext.strokeStyle = b.strokeColor;

        canvasContext.strokeRect(b.x, b.y, brick.width, brick.height);
      }
    }
  }
}

// ball brick collision
function ballBrickCollision() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      // if the brick isn't broken
      if (b.status) {
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + brick.width &&
          ball.y + ball.radius > b.y &&
          ball.y - ball.radius < b.y + brick.height
        ) {
          b.strength -= 1;
          b.fillColor = colors[b.strength];
          if (b.strength <= 0) {
            // BRICK_HIT.play();
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

// CONTROL THE PADDLE
document.addEventListener("keydown", function (event) {
  const keyCode = event.code;
  if (keyCode === "ArrowLeft" || keyCode === "KeyA") {
    leftArrow = true;
  } else if (keyCode === "ArrowRight" || keyCode === "KeyD") {
    rightArrow = true;
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

function levelUp() {
  let isLevelDone = true;

  // check if all the bricks are broken
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      isLevelDone = isLevelDone && !bricks[r][c].status;
    }
  }

  if (isLevelDone) {
    // WIN.play();

    if (LEVEL >= MAX_LEVEL) {
      // showYouWin();
      GAME_OVER = true;
      return;
    }
    LEVEL += 1;
    brick.row = LEVEL;
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

function showYouWin() {
  setTimeout(() => {
    alert("Congrats!!");
  }, 1000);
}

function update() {
  movePaddle();
  moveBall();
  ballWallCollision();
  ballPaddleCollision();
  ballBrickCollision();
  levelUp();
}

function draw() {
  drawPaddle();
  drawBall();
  drawBricks();

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
  if (isPaused) {
    update();
  }
  requestAnimationFrame(loop);
}

loop();

const pauseBtn = document.getElementById("pause");
pauseBtn.addEventListener("click", () => {
  isPaused = !isPaused;
});
