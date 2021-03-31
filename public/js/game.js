const MAXCOUNT = 5; // set maximum mouse click points

var shapes = new Array("rectangle", "square", "circle", "oval", "triangle", "line"); //an array of 5 shapes
var colors = new Array("red", "orange", "yellow", "green", "cyan", "blue", "purple"); //an array of 7 colors
var points = new Array(); // initializing an empty points array
var canvas = doc("#gameCanvas");
var ctx = canvas.getContext("2d");
var timeOut; // variable to enable clearInterval when game is refreshed.

//function doc() that serves as an alias for document.querySelector()
function doc(x) {
  return document.querySelector(x);
} //end doc

//function display() provides a generic method to set display of an html element.
function display(selector, property) {
  doc(selector).style.display = property;
} //end display

//function showGame() makes the canvas, refresh and quit buttons visible. Also hides the play button
function showGame() {
  display("#play", "none"); //hides play button
  display("#gameCanvas", "block");
  drawText();
  display("#gameButtons", "block");
} //end showGame

//function drawText() draws game instructions onto the canvas
function drawText() {
  ctx.font = "1em 'Open Sans',sans-serif";
  let txt = "To start. Please click on 5 arbitrary spots within the box (canvas area).";
  ctx.fillText(txt, 25, 50);
} //end drawText

//function clearCanvas() cLears the canvas and resets game to original (or) start settings.
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  drawText();
  points = new Array();
  Point.resetCount();
  if (timeOut != undefined) {
    clearInterval(timeOut);
  }
} //end clearCanvas

//function hideGame() hides the canvas and div (#gameButtons) element by setting display to none
function hideGame() {
  clearCanvas();
  display("#play", "inline");
  display("#gameCanvas", "none");
  display("#gameButtons", "none");
} //end hideGame

//function getShape selects a shape at random
function getShape() {
  return shapes[Math.floor(Math.random() * shapes.length)];
} //end getShape

//function getColor() selects a color at random
function getColor() {
  return colors[Math.floor(Math.random() * colors.length)];
} //end getColor

//function captureClick() captures mouse click events and initializes Point.
function captureClick(e) {
  if (Point.getCount() < MAXCOUNT) {
    points.push(new Point(e.offsetX, e.offsetY)); //using offsetX and offsetY to get the mouse clicks within canvas that are offset to canvas
	ctx.beginPath();
	ctx.arc(e.offsetX,e.offsetY,3,0,Math.PI*2,true); //drawing a circle using ctx.arc() to indicate mouse clicks
	ctx.fill();
	if (Point.getCount() == MAXCOUNT) {
      timeOut = setInterval(function() { //anonymous function to ietrate over points array to draw shapes.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        drawText();
        for (let point of points) {
          drawShapes(point);
        }
      }, 500);
    }
  } else {
    e.stopPropagation(); //stops capturing mouse click events
  }
} //end captureClick

//function drawShapes() draws shapes onto the canvas centered around the click points.
function drawShapes(point) {
  var shape = getShape();
  var s = point.getShapeDetails(shape);
  ctx.fillStyle = getColor();
  ctx.strokeStyle = getColor();

  switch (shape) {
    case 'rectangle':
      ctx.fillRect(s.centerX, s.centerY, s.width, s.height);
      break;
    case 'square':
      ctx.fillRect(s.centerX, s.centerY, s.width, s.height); //height and width are same for square check getShapeDetails()
      break;
    case 'circle':
      ctx.beginPath();
      ctx.arc(s.centerX, s.centerY, s.radius, s.startAngle, s.endAngle);
      ctx.fill();
      ctx.stroke();
      break;
    case 'oval':
      ctx.beginPath();
      ctx.ellipse(s.centerX, s.centerY, s.radiusX, s.radiusY, s.rotation, s.startAngle, s.endAngle);
      ctx.fill();
      ctx.stroke();
      break;
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x2, s.y2);
      ctx.lineTo(s.x3, s.x3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case 'line':
	  ctx.save(); //ctx.save() saves the current state of the canvas (i.e., before ctx.lineWidth)
      ctx.beginPath();
	  ctx.lineWidth=5; //set lineWidth to be 5 for more visible interpretation
      ctx.moveTo(s.startX, s.startY);
      ctx.lineTo(s.endX, s.endY);
      ctx.stroke();
	  ctx.restore(); //ctx.restore() restores the canvas state before ctx.lineWidth
      break;

  }

} //end drawShapes

//Class declaration for Point
class Point {
  constructor(x, y) { //constructor automatically initializes Point object when instantiated
    this.x = x;
    this.y = y;
    if (Point.count == undefined) { //count is a class property, can be called without instantiation of the Point object
      Point.count = 1;
    } else if (Point.count < MAXCOUNT) {
      Point.count += 1;
    }
  } // end constructor

  //function getCount() returns count of the Point
  static getCount() {
    return (Point.count == undefined) ? 0 : Point.count;
  } //end getCount

  //function resetCount() resets the count of Point
  static resetCount() {
    Point.count = undefined;
  } //end resetCount

  //function getRanger() returns a random number between min and max (both inclusive)
  getRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  } //end getRange

  //fucntion getShapeDetails() returns the shape detials required by the ctx to draw shapes onto the canvas.
  getShapeDetails(shape) {
    let shapeHeight = this.getRange(canvas.height / 6, canvas.height / 2); // selecting height and width at random for a shape between 1/6 and 1/2 of the canvas height and width
    let shapeWidth = this.getRange(canvas.width / 6, canvas.width / 2);
    switch (shape) {
      case 'rectangle':
        this.centerX = Math.floor(this.x - (shapeWidth / 2));
        this.centerY = Math.floor(this.y - (shapeHeight / 2));
        return {  //returns object when getShapeDetails is called
            centerX: this.centerX,
            centerY: this.centerY,
            height: shapeHeight,
            width: shapeWidth
        }
        break;

      case 'square':
        this.centerX = Math.floor(this.x - (shapeWidth / 2));
        this.centerY = Math.floor(this.y - (shapeHeight / 2));
        return {
            centerX: this.centerX,
            centerY: this.centerY,
            height: shapeWidth,
            width: shapeWidth
        }

        case 'circle':
          return {
              radius: shapeWidth / 2,
              centerX: this.x,
              centerY: this.y,
              startAngle: 0,
              endAngle: 2 * Math.PI
          }
          break;

        case 'oval':
          this.rotation = (Math.floor(Math.random() * 2) == 0) ? Math.PI / 2 : Math.PI / 4;
          return {
              centerX: this.x,
              centerY: this.y,
              radiusX: Math.floor(shapeHeight / 2),
              radiusY: Math.floor(shapeWidth / 2),
              rotation: this.rotation,
              startAngle: 0,
              endAngle: 2 * Math.PI

          }
          break;

        case 'triangle':
          this.x1 = this.x;
          this.y1 = (Math.floor(Math.random() * 2) == 0) ? this.y - 100 : this.y - 150;
          this.x2 = (Math.floor(Math.random() * 2) == 0) ? this.x + 100 : this.x + 150;
          this.y2 = (Math.floor(Math.random() * 2) == 0) ? this.y + 100 : this.y + 150;
          this.x3 = (Math.floor(Math.random() * 2) == 0) ? this.x - 100 : this.x - 150;
          this.y3 = (Math.floor(Math.random() * 2) == 0) ? this.y + 100 : this.y + 150;
          return {
              x1: this.x1,
              y1: this.y1,
              x2: this.x2,
              y2: this.y2,
              x3: this.x3,
              y3: this.y3
          }
          break;

        case 'line':
          this.startX = (Math.floor(Math.random() * 2) == 0) ? this.x - 150 : this.x - 100;
          this.startY = (Math.floor(Math.random() * 2) == 0) ? this.y - 150 : this.y - 100;
          this.endX = (Math.floor(Math.random() * 2) == 0) ? this.x + 150 : this.x + 100;
          this.endY = (Math.floor(Math.random() * 2) == 0) ? this.y + 150 : this.y + 100;
          return {
              startX: this.startX,
              startY: this.startY,
              endX: this.endX,
              endY: this.endY
          }
          break;

    }
  } //end getShapeDetails
} //end Point
