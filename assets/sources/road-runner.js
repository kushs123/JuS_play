const road = document.getElementById("road_id");
const car = document.getElementById("car_id");
const game = document.querySelector(".start_game");
const scoreElement = document.getElementById("score");
var player_value = false;
game.addEventListener('click', start);
let speed = 5;
window.onload = function(){
  for(let i=0; i<=5; i++){
    const roadLine = document.createElement("div");
    roadLine.classList.add("roadLine");
    roadLine.y = (120*i);
    roadLine.style.top = `${roadLine.y}px`;
    road.appendChild(roadLine);
    console.log("hello");
  }      
}
var score;
function start(e){
  e.preventDefault();
  score = 0;
  game.style.display = "none";
  player_value = true;
  randomCar();
  window.requestAnimationFrame(startGame);
}

function startGame(e){
  if(player_value){
    document.addEventListener('keydown', keyUp);
    moveLines();
    moveCars();
    score++;
    incrementScore(score);
  }
  window.requestAnimationFrame(startGame);
}
function isCollide(car, enemyCar){
  var mainCarRect = car.getBoundingClientRect();
  var enemyCarRect = enemyCar.getBoundingClientRect();
  return !((mainCarRect.top>enemyCarRect.bottom || mainCarRect.bottom<enemyCarRect.top) || (mainCarRect.right<enemyCarRect.left || mainCarRect.left>enemyCarRect.right))
}
function incrementScore(score){
  scoreElement.innerText = score;
}
function removeCars(){
  const divs = document.querySelectorAll(".enemyCar");
  divs.forEach(item=>item.remove());
}
function moveCars(){
  const divs = document.querySelectorAll(".enemyCar");
  divs.forEach(function(item){
       if(isCollide(car, item)){
         const p = document.querySelectorAll("p");
         //console.log(p);
         speed = 5;
         player_value = false;
         removeCars();
         game.style.display = "block";
       }
       if(item.y >= 600){
         item.y = -300;
         item.style.left = Math.floor(Math.random()*350 + 30) + "px";
       }
         item.y += speed;
        item.style.top = `${item.y}px`
   })
}

function moveLines(){
  const divs = document.querySelectorAll(".roadLine");
  divs.forEach(function(item){
       if(item.y >=600){
         item.y = item.y - 650;
       }
         item.y += speed;        
        item.style.top = `${item.y}px`
   })
}
var left, right, interval, count = 0;
function randomCar(){
    for(let i=0; i<3; i++){
      const enemyCar = document.createElement("div");
      enemyCar.classList.add("enemyCar");
      enemyCar.y = ((i+1) * 350) * -1;
      enemyCar.style.top = `${enemyCar.y}px`;
      enemyCar.style.left = Math.floor(Math.random()*350 + 30) + "px";
      road.appendChild(enemyCar);
    }
}

function generateCar(left , right){
  const car = document.createElement("div");
  car.classList.add("car");
  car.style.left = `${left-100+car.getBoundingClientRect().width}px`;
  car.style.right = `${right-100+car.getBoundingClientRect().width}px`
  car.style.top = `${Math.random()*500}px`
  road.appendChild(car);
}

function keyUp(e){
  e.preventDefault();
  playGame(e.key);
}


function playGame(eventKey){
  let top = car.offsetTop;
  let left = car.offsetLeft;
  if(eventKey === "ArrowDown"){
    car.style.top = `${top+10}px`;
  }else if(eventKey === "ArrowUp"){
    car.style.top = `${top-10}px`;
  }else if(left>0 && eventKey === "ArrowLeft"){
    car.style.left = `${left-10}px`;
  }else if(left<road.getBoundingClientRect().right-left+70 && eventKey === "ArrowRight"){
    car.style.left = `${left+10}px`;
  }
}


