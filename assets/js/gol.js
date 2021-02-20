    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    const size = 350;
    const scale = 3.5;
    const resolution = size / scale;
    let cells;
    let col = "black";
    let colorPicker;
    let speed = 400;
    let slider = new Slider("#sliderspeed");
    let pos = {
        x: 0,
        y: 0
    };
    let myInterval;
    let running = false;
    let clear = false;
    let rainbow = false;
    let generation = 0;

    //Mouse event listeners 
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mousedown', setPosition);
    canvas.addEventListener('mouseup', setPosition);
    document.getElementById("start").addEventListener("click", start);
    document.getElementById("rainbow").addEventListener("click", function () {
        rainbow = !rainbow;
    });
    //bug. clicking rainbow when programme running clears all the cells colors
    document.getElementById("generate").addEventListener("click", function () {
        randomCells();
        drawCells();
    });
    document.getElementById("colorPicker").addEventListener("change", function () {
        col = this.value;
        this.select();
    });
    document.getElementById("clear").addEventListener("click", clearCells);

    document.getElementById("generationVal").innerHTML = generation;


    // https://seiyria.com/bootstrap-slider/
    slider.on("slide", function (sliderValue) {
        document.getElementById("sliderVal").textContent = sliderValue;
        speed = sliderValue;
        start();
    });
    resize();
    setup();

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
        generation = 0;
        for (let y = 0; y < resolution; y++) {
            for (let x = 0; x < resolution; x++) {
                if (clear) cells[x][y] = false;
                else if (Math.random() < 0.5) cells[x][y] = true;
            }
        }
    }

    //Clears the array by changing all cells to false
    function clearCells() {
        for (let y = 0; y < resolution; y++) {
            for (let x = 0; x < resolution; x++) {
                cells[x][y] = false;
            }
        }
        step();
        generation = 0;
        document.getElementById("generationVal").innerHTML = generation;
    }

    //
    function rainbowCells() {
        randCol = Math.floor(Math.random() * 16777215).toString(16);
        return "#" + randCol;
    }

    //Draws onto cells
    function drawCells() {
        ctx.fillStyle = "rgba(255,255,240,0.7)";
        ctx.fillRect(0, 0, resolution, resolution);
        for (let y = 0; y < resolution; y++) {
            for (let x = 0; x < resolution; x++) {
                if (cells[x][y]) {
                    if (rainbow) ctx.fillStyle = rainbowCells();

                    else {
                        ctx.fillStyle = col;
                        ctx.fillRect(x, y, 1, 1);
                    }
                } else if (!cells[x][y]) {
                    ctx.fillStyle = "rgba(255,255,240,0.7)";
                    ctx.fillRect(x, y, 1, 1)
                }
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
        generation++;
        document.getElementById("generationVal").innerHTML = generation;
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

    //Start simulation and check interval
    function start() {
        clearInterval(myInterval)
        myInterval = setInterval(function () {
            if (running) step();
        }, speed);
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
        pos.x = Math.floor(e.offsetX / scale);
        pos.y = Math.floor(e.offsetY / scale);
        cells[pos.x][pos.y] = true;
    }