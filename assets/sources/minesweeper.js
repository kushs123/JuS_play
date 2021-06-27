var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var resetBtn = document.getElementById('reset');

var canvasLeft = canvas.offsetLeft,
  canvasTop = canvas.offsetTop;

var gridCols;
var gridRows;
var gridMatrix;
var cellWidth = 40;
var totalMines = 20;

var Cell = function(i, j, w) {
  this.i = i;
  this.j = j;
  this.x = i * w;
  this.y = j * w;
  this.w = w;
  this.h = this.w;
  this.neighborCount = 0;
  this.hasMine = false;
  this.isRevealed = false;
}

Cell.prototype.show = function() {
  ctx.strokeStyle = "#000000";
  ctx.strokeRect(this.x, this.y, this.w, this.h);
  if (this.isRevealed) {
    if (this.hasMine) {
      ctx.fillStyle = "#cccccc";
      ctx.fillRect(this.x, this.y, this.w, this.h);
      drawEllipse(ctx, this.x + this.w * 0.25, this.y + this.w * 0.25, this.w * 0.5, this.w * 0.5);
    } else {
      if (this.neighborCount > 0) {
        ctx.fillStyle = "#cccccc";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "CENTER";
        ctx.fillText(this.neighborCount, this.x + 15, this.y + 28);
      } else {
        ctx.fillStyle = "#dddddd";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "CENTER";
      }
    }
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

Cell.prototype.countNeighbors = function() {
  if (this.hasMine) {
    this.neighborCOunt = -1;
    return;
  }
  var totalNeighbors = 0;
  for (var xoff = -1; xoff <= 1; xoff++) {
    for (var yoff = -1; yoff <= 1; yoff++) {
      var i = this.i + xoff;
      var j = this.j + yoff;
      if (i > -1 && i < gridCols && j > -1 && j < gridRows) {
        var neighbor = gridMatrix[i][j];
        if (neighbor.hasMine) {
          totalNeighbors++;
        }
      }
    }
  }
  this.neighborCount = totalNeighbors;
}

Cell.prototype.contain = function(x, y) {
  if (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w) {
    return true;
  } else {
    return false;
  }
}

Cell.prototype.reveal = function() {
  this.isRevealed = true;
  if (this.neighborCount == 0) {
    this.floodFill();
  }
}

Cell.prototype.floodFill = function() {
  if (this.hasMine) {
    for (var i = 0; i < gridCols; i++) {
      for (var j = 0; j < gridRows; j++) {
        gridMatrix[i][j].isRevealed = true;
      }
    }
  }
  var totalNeighbors = 0;
  for (var xoff = -1; xoff <= 1; xoff++) {
    for (var yoff = -1; yoff <= 1; yoff++) {
      var i = this.i + xoff;
      var j = this.j + yoff;
      if (i > -1 && i < gridCols && j > -1 && j < gridRows) {
        var neighbor = gridMatrix[i][j];
        if (!neighbor.hasMine && !neighbor.isRevealed) {
          neighbor.reveal();
        }
      }
    }
  }
}

function createMatrix(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

function setup() {
  var options = [];
  gridCols = Math.floor(canvas.width / cellWidth);
  gridRows = Math.floor(canvas.height / cellWidth);
  gridMatrix = createMatrix(gridCols, gridRows);
  for (var i = 0; i < gridCols; i++) {
    for (var j = 0; j < gridRows; j++) {
      gridMatrix[i][j] = new Cell(i, j, cellWidth);
      options.push([i, j]);
    }
  }

  for (var n = 0; n < totalMines; n++) {
    var index = Math.floor(Math.random() * options.length);
    var f = options[index][0];
    var g = options[index][1];
    options.splice(index, 1);
    gridMatrix[f][g].hasMine = true;
  }

  for (var a = 0; a < gridCols; a++) {
    for (var b = 0; b < gridRows; b++) {
      gridMatrix[a][b].countNeighbors();
    }
  }
  render();
  canvas.addEventListener('click', function() {
    var x = event.pageX - canvasLeft,
      y = event.pageY - canvasTop;
    for (var i = 0; i < gridCols; i++) {
      for (var j = 0; j < gridRows; j++) {
        if (gridMatrix[i][j].contain(x, y)) {
          gridMatrix[i][j].reveal();
          render();
        }
      }
    }
  })
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < gridCols; i++) {
    for (var j = 0; j < gridRows; j++) {
      gridMatrix[i][j].show();
    }
  }
}

function drawEllipse(ctx, x, y, w, h) {
  var kappa = 0.5522848,
    ox = (w / 2) * kappa, // control point offset horizontal
    oy = (h / 2) * kappa, // control point offset vertical
    xe = x + w, // x-end
    ye = y + h, // y-end
    xm = x + w / 2, // x-middle
    ym = y + h / 2; // y-middle
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.moveTo(x, ym);
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  ctx.fill();
  ctx.stroke();
}


reset.addEventListener('click', function() {
  setup();
})

setup();