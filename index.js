const canvas = document.getElementById("game");
const canvasContext = canvas.getContext("2d");

canvas.style.border = "1px solid #0ff";

canvasContext.lineWidth = 0.5;

// GAME VARIABLES AND CONSTANTS
const PADDLE_WIDTH = 120;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 40;
const BALL_RADIUS = 12;

let LIFE = 3; // PLAYER HAS 3 LIVES
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 5;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;

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
  speed: 5,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3,
};

// DRAW THE BALL
function drawBall() {
  canvasContext.beginPath();

  canvasContext.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  canvasContext.fillStyle = "#ffcd05";
  canvasContext.fill();

  canvasContext.strokeStyle = "#2e3548";
  canvasContext.stroke();

  canvasContext.closePath();
}

// MOVE THE BALL
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

// function drawPaddle() {
//   canvasContext.fillStyle = "rgba(255, 99, 71, 1)";
//   canvasContext.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
//   canvasContext.strokeStyle = "#000";
//   canvasContext.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
// }

function drawPaddle() {
  var image2 = new Image();
  image2.src = "./img/paddle.png";
  canvasContext.drawImage(
    image2,
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
  ball = {
    x: canvas.width / 2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 5,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3,
  };
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
  row: 1,
  column: 1,
  width: 55,
  height: 20,
  offSetLeft: 40,
  offSetTop: 20,
  marginTop: 40,
};

let bricks = [];

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
        stregnth: 2,
        fillColor: "#2e3548",
        strokeColor: "yellow",
      };
    }
  }

  for (let r = 1; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
        y:
          r * (brick.offSetTop + brick.height) +
          brick.offSetTop +
          brick.marginTop,
        status: true,
        stregnth: 1,
        fillColor: "red",
        strokeColor: "#FFF",
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

        canvasContext.strokeStyle = brick.b;
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
          b.stregnth -= 1;
          console.log(b.stregnth);
          if (b.stregnth <= 0) {
            // BRICK_HIT.play();
            ball.dy = -ball.dy;
            b.status = false; // the brick is broken
            SCORE += SCORE_UNIT;
          } else {
            console.log("Cas");
            // let collidePoint = ball.x - (b.x + b.width / 2);

            // // NORMALIZE THE VALUES
            // collidePoint = collidePoint / (b.width / 2);

            // // CALCULATE THE ANGLE OF THE BALL
            // let angle = (collidePoint * Math.PI) / 3;

            // ball.dx = ball.speed * Math.sin(angle);
            // ball.dy = -ball.speed * Math.cos(angle);

            ball.dx = -ball.dx;
            ball.dy = -ball.dy;
          }
        }
      }
    }
  }
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
      showYouWin();
      GAME_OVER = true;
      return;
    }
    brick.row++;
    createBricks();
    ball.speed += 0.5;
    resetGame();
    LEVEL++;
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
}

function loop() {
  // CLEAR THE CANVAS
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  draw();
  update();
  requestAnimationFrame(loop);
}

loop();
