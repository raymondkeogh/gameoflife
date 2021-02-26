    document.addEventListener("DOMContentLoaded", startup);

    function startup() {

        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        let size = 500;
        let scale = size / 100;
        const resolution = size / scale;
        let cells = make2dArray();
        let col = "black";
        let colorPicker;
        let speed = 400;
        let slider1 = new Slider("#sliderspeed", {
            min: 50,
            max: 700,
            step: 1,
            value: 500,
            reversed: true,
            tooltip_position: 'bottom'
        });

        let slider2 = new Slider("#zoom", {
            min: 5.5,
            max: 12,
            step: 0.5,
            value: 5.5,
            tooltip_position: 'bottom'
        });

        let pos = {
            x: 0,
            y: 0
        };
        let myInterval;
        let running = false;
        let clear = true;
        let rainbow = false;
        let generation = 0;

        var sliderPicker = new iro.ColorPicker("#colorBar", {
            width: 250,
            color: "rgb(255, 0, 0)",
            borderWidth: 1,
            borderColor: "#fff",
            layout: [{
                component: iro.ui.Slider,
                options: {
                    sliderType: 'hue'
                }
            }, ]
        });

        // Event Listeners 
        window.addEventListener('resize', resize);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mousedown', setPositionMouse);
        canvas.addEventListener('mouseup', setPositionMouse);
        canvas.addEventListener("touchstart", setPositionTouch);
        canvas.addEventListener("touchmove", drawTouch);
        canvas.addEventListener("touchend", setPositionTouch);
        document.getElementById("start").addEventListener("click", function () {
            start();
            running = !running;
        });
        document.getElementById("rainbow").addEventListener("click", function () {
            rainbow = !rainbow;
            if (clear)
                alert("Please draw inside the circle or click 'Random' button before hitting 'Start'");
        });
        document.getElementById("generate").addEventListener("click", function () {
            randomCells();
            drawCells();
        });
        document.getElementById("clear").addEventListener("click", clearCells);
        document.getElementById("generationVal").innerHTML = generation;
        // https://seiyria.com/bootstrap-slider/
        slider1.on("slide", function (sliderValue) {
            document.getElementById("sliderVal").textContent = sliderValue;
            speed = sliderValue;
            if (!clear) start();
        });
        slider1.on("change", function (e) {
            let a = e.newValue;
            document.getElementById("sliderVal").textContent = a;
            speed = a;
            if (!clear) start();
        });
        slider2.on("slide", function (zoomValue) {
            document.getElementById("zoomVal").textContent = zoomValue;
            scale = zoomValue;
            resize();
            if (!clear) start();
        });
        slider2.on("change", function (e) {
            var a = e.newValue;
            document.getElementById("zoomVal").textContent = a;
            scale = a;
            resize();
            if (!clear) start();
        })
        // Code I used for colour slider https://www.cssscript.com/sleek-html5-javascript-color-picker-iro-js/#basic
        sliderPicker.on('input:change', function (color) {
            col = color.hexString;
        })

        //-------------Screen Change functions and event handlers 

        //https://www.w3schools.com/howto/howto_js_media_queries.asp
        function screenChange() {
            size = 320;
            scale = 5.5;
            canvas.width = size;
            canvas.height = size;
            ctx.scale(scale, scale);
        }

        var em = window.matchMedia("(max-width: 700px)")
        screenChange(em) // Call listener function at run time
        em.addListener(screenChange) // Attach listener function on state changes

        function resize() {
            canvas.width = size;
            canvas.height = size;
            ctx.scale(scale, scale);
        }
        resize();

        //Setup 2D Array to take data from canvas
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
            clear = false;
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
            generation = -1;
            running = false;
            clear = true;
            step();
            document.getElementById("generationVal").innerHTML = generation;
        }

        function rainbowCells() {
            randCol = Math.floor(Math.random() * 16777215).toString(16);
            return "#" + randCol;
        }

        //Draws onto the array with data from cells[x][y]
        function drawCells() {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, resolution, resolution);
            for (let y = 0; y < resolution; y++) {
                for (let x = 0; x < resolution; x++) {
                    if (cells[x][y]) {
                        if (rainbow) ctx.fillStyle = rainbowCells();
                        else
                            ctx.fillStyle = col;
                        ctx.fillRect(x, y, 1, 1);
                    } else if (!cells[x][y]) {
                        ctx.fillStyle = "rgba(255,255,240,0.7)";
                        ctx.fillRect(x, y, 1, 1)
                    }
                }
            }
        }

        //Steps through cell states
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

        //Game of Life rules assesement
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
            if (clear) {
                alert("Please draw inside the circle or click 'Random' button before hitting 'Start'!");
                return;
            } else {
                clearInterval(myInterval)
                myInterval = setInterval(function () {
                    if (running) step();
                }, speed);
            }
        }

        //Touch and mouse input functions ----
        //Get mouse event and assign x and y coordinates to cells[]
        function setPositionMouse(e) {
            var gbcr = canvas.getBoundingClientRect();
            pos.x = Math.floor((e.clientX - gbcr.x) / scale);
            pos.y = Math.floor((e.clientY - gbcr.y) / scale);
            cells[pos.x][pos.y] = true;
        }

        //Get touch event and assign x and y coordinates to cells[]
        function setPositionTouch(e) {
            var gbcr = canvas.getBoundingClientRect();
            pos.x = Math.floor((e.touches[0].clientX - gbcr.x) / scale);
            pos.y = Math.floor((e.touches[0].clientY - gbcr.y) / scale);
            cells[pos.x][pos.y] = true;
        }

        //Draw touch inputs to canvas and assign x and y coordinates to cells[]
        function drawTouch(e) {
            e.preventDefault();
            for (var i = 0; i < e.touches.length; i++) {
                if (pos.x && pos.y) {
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.lineCap = 'round';
                    ctx.moveTo(pos.x, pos.y);
                    setPositionTouch(e);
                    ctx.lineTo(pos.x, pos.y);
                    if (rainbow) ctx.strokeStyle = rainbowCells();
                    else ctx.strokeStyle = col;
                    ctx.stroke();
                    clear = false;
                }
            }
        }

        //Draw from mouse inputs to canvas
        function draw(e) {
            if (e.buttons !== 1) return;
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.lineCap = 'square';
            ctx.moveTo(pos.x, pos.y);
            setPositionMouse(e);
            ctx.lineTo(pos.x, pos.y);
            if (rainbow) ctx.strokeStyle = rainbowCells();
            else ctx.strokeStyle = col;
            ctx.stroke();
            clear = false;
        }
    }
