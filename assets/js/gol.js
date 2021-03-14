    document.addEventListener("DOMContentLoaded", startup);

    function startup() {
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        let size = 450;
        let scale = size / 100;
        const resolution = size / scale;
        let cells = make2dArray();
        let col = "black";
        let speed = 400;
        let slider1 = new Slider("#sliderspeed", {
            min: 50,
            width: 20,
            max: 700,
            step: 1,
            value: 500,
            reversed: true,
            tooltip_position: 'bottom'
        });

        let slider2 = new Slider("#zoom", {
            min: 7,
            max: 12,
            step: 0.5,
            value: 11,
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
        let sliderPicker = new iro.ColorPicker("#colorBar", {
            width: 150,
            color: "rgb(255, 0, 0)",
            borderWidth: 1,
            borderColor: "#fff",
            layout: [{
                component: iro.ui.Slider,
                options: {
                    sliderType: 'hue',
                    layoutDirection: "horizontal"
                }
            }, ]
        });
        scale = slider2.options.value;

        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });

        // Event Listeners 
        window.addEventListener('resize', resize);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mousedown', setPositionMouse);
        canvas.addEventListener('mouseleave', leaveCanvas)
        canvas.addEventListener('mouseup', dropPosition);
        canvas.addEventListener("touchstart", setPositionTouch);
        canvas.addEventListener("touchmove", drawTouch);
        canvas.addEventListener("touchend", dropPosition);
        document.getElementById("start").addEventListener("click", function () {
            start();
        });

        document.getElementById("rainbow").addEventListener("click", function () {
            rainbow = !rainbow;
            if (clear)
                alert("Please draw inside the circle or click 'Seed' button before hitting 'Start'");
        });

        document.getElementById("generate").addEventListener("click", function () {
            randomCells();
            drawCells();
        });

        document.getElementById("clear").addEventListener("click", clearCells);
        document.getElementById("generationVal").innerHTML = generation;

        scale = slider2.options.value;

        console.log("scale is : " + scale);

        // https://seiyria.com/bootstrap-slider/
        slider1.on("slide", function (sliderValue) {
            document.getElementById("speedSlider").textContent = sliderValue;
            speed = sliderValue;
            if (!clear) {
                clearInterval(myInterval);
                myInterval = setInterval(function () {
                    if (running) step();
                }, speed);
            }
        });
        slider1.on("change", function (e) {
            let a = e.newValue;
            document.getElementById("speedSlider").textContent = a;
            speed = a;
            if (!clear) {
                clearInterval(myInterval);
                myInterval = setInterval(function () {
                    if (running) step();
                }, speed);
            }
        });
        slider2.on("slide", function (zoomValue) {
            document.getElementById("zoomVal").textContent = zoomValue;
            scale = zoomValue;
            resize();

            if (!running) step();
        });
        slider2.on("change", function (e) {
            var a = e.newValue;
            document.getElementById("zoomVal").textContent = a;
            scale = a;
            resize();
            if (!running) step();
        });
        // Code I used for colour slider https://www.cssscript.com/sleek-html5-javascript-color-picker-iro-js/#basic
        sliderPicker.on('input:change', function (color) {
            col = color.hexString;
        });

        //-------------Screen Change functions and event handlers 
        //https://stackoverflow.com/questions/49989723/how-can-i-force-a-matching-window-matchmedia-to-execute-on-page-load

        function checkScreen() {
            // medias (as an array to make it a little easier to manage)
            var mqls = [
                window.matchMedia("screen and (max-width: 350px)"),
                window.matchMedia("(min-width: 356px) and (max-width: 991px)"),
                window.matchMedia("(min-width: 992px) and (max-width: 1800px)"),
                window.matchMedia("(min-width: 1801px)")
            ];
            // event listeners
            for (var i = 0; i < mqls.length; i++) {
                mqls[i].addListener(mqh);
            }
            // matches methods
            function mqh() {
                if (mqls[0].matches) {
                    size = 250;
                    resize();
                } else if (mqls[1].matches) {
                    size = 300;
                    resize();
                } else if (mqls[2].matches) {
                    size = 300;
                    resize();
                } else if (mqls[3].matches) {
                    size = 500;
                    resize();
                }
            }
            mqh();
        }

        checkScreen();

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
            rainbow = false;
            step();
            document.getElementById("generationVal").innerHTML = generation;
            $('input[type=checkbox]').prop('checked', false);
        }

        function rainbowCells() {
            let randCol = Math.floor(Math.random() * 16777215).toString(16);
            return "#" + randCol;
        }

        //Draws onto the array with data from cells[x][y]
        function drawCells() {
            //ctx.clearRect(0, 0, resolution, resolution);
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.fillRect(0, 0, resolution, resolution);
            for (let y = 0; y < resolution; y++) {
                for (let x = 0; x < resolution; x++) {
                    if (cells[x][y]) {
                        if (rainbow) {
                            ctx.lineWidth = 1;
                            ctx.lineCap = 'round';
                            ctx.lineTo(x, y);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.strokeStyle = rainbowCells();

                        } else {
                            ctx.lineWidth = 1;
                            ctx.lineCap = 'round';
                            ctx.lineTo(x, y);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.strokeStyle = col;
                        }
                    } else if (!cells[x][y]) {
                        ctx.fillStyle = "rgba(255,255,240,0.5)";
                        ctx.fillRect(x, y, 1, 1);
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
            if (generation <= 1) {
                document.getElementById("generationLabel").innerHTML = "Generation";
            } else {
                document.getElementById("generationLabel").innerHTML = "Generations";
            }
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
                document.getElementById("start").checked = false;
                return;
            } else {
                //if()
                running = !running;
                clearInterval(myInterval);
                myInterval = setInterval(function () {
                    if (running) step();
                }, speed);
            }
        }

        //Touch and mouse input functions ----
        //Get mouse event and assign x and y coordinates to cells[]
        function setPositionMouse(e) {
            dragging = true;
            draw(e);
        }
        let dragging = false;
        //Get touch event and assign x and y coordinates to cells[]
        function setPositionTouch(e) {
            dragging = true;
            var gbcr = canvas.getBoundingClientRect();
            pos.x = Math.floor((e.touches[0].clientX - gbcr.x) / scale);
            pos.y = Math.floor((e.touches[0].clientY - gbcr.y) / scale);
        }

        function dropPosition() {
            dragging = false;
            ctx.beginPath();
        }

        function leaveCanvas() {
            dragging = false;
        }

        //Draw touch inputs to canvas and assign x and y coordinates to cells[]
        function drawTouch(e) {
            e.preventDefault();
            if (dragging) {
                for (var i = 0; i < e.touches.length; i++) {
                    if (pos.x && pos.y) {
                        ctx.lineWidth = 1;
                        ctx.lineCap = 'round';
                        ctx.lineTo(pos.x, pos.y);
                        ctx.stroke();
                        ctx.beginPath();
                        setPositionTouch(e);
                        cells[pos.x][pos.y] = true;
                        if (rainbow) ctx.strokeStyle = rainbowCells();
                        else ctx.strokeStyle = col;
                        ctx.stroke();
                        clear = false;
                    }
                }
            }
        }


        // let ta = {
        //     x1: 0,
        //     y1: 0,
        //     x2: 0,
        //     y2: 0
        // };
        // ta.x1 = pos.x;
        // ta.x2 = pos.y;

        //Draw from mouse inputs to canvas
        function draw(e) {
            if (dragging) {
                var gbcr = canvas.getBoundingClientRect();
                pos.x = Math.floor((e.clientX - gbcr.x) / scale);
                pos.y = Math.floor((e.clientY - gbcr.y) / scale);
                ctx.lineWidth = 1;
                ctx.lineCap = 'round';
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
                ctx.beginPath();
                cells[pos.x][pos.y] = true;
                if (rainbow) ctx.strokeStyle = rainbowCells();
                else ctx.strokeStyle = col;
                ctx.stroke();
                clear = false;
            }
        }
    }