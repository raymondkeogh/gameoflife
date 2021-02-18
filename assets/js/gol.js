var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.style.border = "2px solid black";
const size = 500;

window.onload = function () {
    window.addEventListener('resize', resize);
}


resize();
function resize() {
    canvas.width = size;
    canvas.height = size;
}
