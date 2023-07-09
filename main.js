let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
const scoreTxt = document.getElementById('score')
const heartTxt = document.getElementById('heart')


let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 2;
let dy = -2;

let ballRadius = 5;

let paddleHeight = 5;
let paddleWidth = 60;
let paddleX = (canvas.width - paddleWidth) / 2

let rigthPressed = false;
let leftPressed = false;

let brickRowCount = 20;
let brickColumnCount = 8;
let brickWidth = 30;
let brickHeight = 10;
let brickPadding = 7;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let score = 0;

let lives = 2;

const start = document.querySelector('.start_btn')
const restart = document.querySelector('.restart_btn')

let bricks = []
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {
      x: 0,
      y: 0,
      status: 1
    }
  }
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2
  }
}

function keyDownHandler(event) {
  if (event.keyCode == 39) {
    rigthPressed = true;
  } else if (event.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.keyCode == 39) {
    rigthPressed = false;
  } else if (event.keyCode == 37) {
    leftPressed = false;
  }
}


function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          scoreTxt.innerText= score
          if(score == brickRowCount*brickColumnCount) {
            alert('YOU WIN, CONGRATULATIONS!');
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawBall() {

  ctx.beginPath();
  ctx.arc(x, y+10, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();

}


function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {

      if (bricks[c][r].status == 1) {

        let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop

        bricks[c][r].x = brickX
        bricks[c][r].y = brickY
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095dd'
        ctx.fill()
        ctx.closePath();

      }
    }
  }
}



function drawPaddle() {

  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095dd'
  ctx.fill();
  ctx.closePath();

}


function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {

    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy
    } else {
      lives--;
      heartTxt.innerText = lives;
      if(!lives) {
        clearInterval(interval)
        restart.style.display = 'block';
      } else {
        x = canvas.width / 2
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2
      }
    }
  }

  if (rigthPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 5;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 5;
  }

  x += dx;
  y += dy;

}

let interval


start.addEventListener('click', function() {
  document.querySelector('.start').style.display = 'none'

  interval = setInterval(draw, 20)

})


restart.addEventListener('click', function() {
  this.style.display = 'none'

  document.location.reload();
})
