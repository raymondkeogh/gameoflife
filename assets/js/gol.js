var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const size = 350;

window.onload = function () {
    window.addEventListener('resize', resize);
}

resize();

function resize() {
    canvas.width = size;
    canvas.height = size;
}

// https://seiyria.com/bootstrap-slider/

var slider = new Slider("#sliderspeed");
slider.on("slide", function(sliderValue) {
	document.getElementById("sliderVal").textContent = sliderValue;
});