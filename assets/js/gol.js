var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const size = 350;
const scale = 3.5;
const resolution = size / scale;
let cells;
let col = "black";
var slider = new Slider("#sliderspeed");
window.onload = function () {
    window.addEventListener('resize', resize);
}


// https://seiyria.com/bootstrap-slider/

slider.on("slide", function(sliderValue) {
	document.getElementById("sliderVal").textContent = sliderValue;
});

resize();
setup();
randomCells();
drawCells();

function resize() {
    canvas.width = size;
    canvas.height = size;
    ctx.scale(scale, scale);
}

function setup() {
    cells = make2dArray();
}


// I used this tutorial to help create the game of life functions randomCells() and drawCells()  https://www.youtube.com/watch?v=0uSbNMUU_94
//Create 2D Array to take input from cells

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




