var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const size = 350;
const scale = 3.5;
const resolution = size / scale;
let cells;
let col = "black";
var slider = new Slider("#sliderspeed");
let pos = {x:0, y:0};
window.onload = function () {
    window.addEventListener('resize', resize);
}


document.addEventListener('DOMContentLoaded', () => {
            document.querySelector('canvas').addEventListener('click', f);
        });

        function f(ev) {
            console.log(ev.target.tagName, 'clicked');
            console.log('clientX', ev.clientX);
            console.log('pageX', ev.pageX);
            console.log('screenX', ev.screenX);
            console.log('offsetX', ev.offsetX);

        }





// https://seiyria.com/bootstrap-slider/

slider.on("slide", function(sliderValue) {
	document.getElementById("sliderVal").textContent = sliderValue;
});


resize();
setup();
//randomCells();
speed();

function resize() {
    canvas.width = size;
    canvas.height = size;
    ctx.scale(scale, scale);
}

function setup() {
    cells = make2dArray();
}

function make2dArray() {
    let arr = new Array(resolution);
    for (let i = 0; i < resolution; i++) {
        arr[i] = [];
        for (let j = 0; j < resolution; j++) {
            arr[i][j] = false;
        }
    }
    return arr;
}

// I used this tutorial to help create the game of life functions randomCells() and drawCells()  https://www.youtube.com/watch?v=0uSbNMUU_94
//Create 2D Array to take input from cells


//Randomly fills cells
function randomCells() {
    ctx.fillStyle = "rgba(255,255,240,0.7)";
    ctx.fillRect(0, 0, resolution, resolution);
    for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
            if (Math.random() < 0.5) cells[x][y] = true;
        }
    }
}

//Draws onto cells
function drawCells() {
    ctx.fillStyle =  "rgba(255,255,240,0.7)";
    ctx.fillRect(0, 0, resolution, resolution);
    ctx.fillStyle = col;
    for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
            if (rainbow) {
                ctx.fillStyle = "red";
            }
            if (cells[x][y]) ctx.fillRect(x, y, 1, 1);
        }
    }
}

//Steps through cells states
function step() {
    let newCells = make2dArray();
    for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
            const neighbours = getNeighbourCount(x, y);
            if (cells[x][y] && neighbours >= 2 && neighbours <= 3) newCells[x][y] = true;
            else if (!cells[x][y] && neighbours === 3) newCells[x][y] = true;
        }
    }
    cells = newCells;
    drawCells();
    
}
//Game of life rules assesement
function getNeighbourCount(x, y) {
    let count = 0;
    for (let yy = -1; yy < 2; yy++) {
        for (let xx = -1; xx < 2; xx++) {
            if (xx === 0 && yy === 0) continue;
            if (x + xx < 0 || x + xx > resolution - 1) continue;
            if (y + yy < 0 || y + yy > resolution - 1) continue;
            if (cells[x + xx][y + yy]) count++;
        }
    }
    return count;
}

function speed() {
    var speed = setInterval(step, 200);
}

window.onload = function () {
    //Mouse event listeners 
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', draw);
    document.addEventListener('mousedown', setPosition);
    document.addEventListener('mouseup', setPosition);
}

//Draw from mouse inputs
function draw(e) {
    if (e.buttons !== 1) return;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.moveTo(pos.x, pos.y);
    setPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = col;
    ctx.stroke();
}

//Get coordinates from mouse event
function setPosition(e) {
    pos.x = Math.floor(e.offsetX *0.3);
    pos.y = Math.floor(e.offsetY *0.3);
    cells[pos.x][pos.y] = true;
}
