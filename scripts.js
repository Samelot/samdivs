(function() {
    var App;
    App = {};

    var currentSwitch = [];
    /*
    Init 
  */
    App.init = function() {
        //var b = 2;

        // App. isn't the factor in client/server consistency.
        App.canvas = document.createElement('canvas');
        //var hii = document.createElement('div');
        //hii.textContent = "supsup";

        App.docfrag = document.createDocumentFragment();

        /*
    var browserList = ["Internet Explorer", "Mozilla Firefox", "Safari", "Chrome", "Opera"];

    browserList.forEach(function(e) {
      var li = document.createElement("div");
      li.textContent = e;
      docfrag.appendChild(li);
    });
    */

        // Similar to the above, except uses forEach. Tasty. Which one is better? 
        // Ask on stackexchange. Find ways to test. What (code) Tcomes later might factor in!!
        var clausname = "claus claus claus claus claus"
        var cars = clausname.split(' ');
        for (var c in cars) {
            bob = document.createElement('div');
            bob.id = "claus" + c;
            bob.className = "clausStyle";
            bob.innerHTML = cars[c];
            App.docfrag.appendChild(bob);
        }

        App.canvas.height = 400;
        App.canvas.width = 480;
        // Creates canvas inside article tag/element.
        document.getElementsByTagName('article')[0].appendChild(App.canvas);
        document.getElementsByClassName('menu')[0].appendChild(App.docfrag);
        //document.getElementsByTagName('article')[0].appendChild(App.docfrag);
        App.ctx = App.canvas.getContext("2d");
        App.ctx.fillStyle = "solid";
        App.ctx.strokeStyle = "#ECD018";
        App.ctx.lineWidth = 5;
        App.ctx.lineCap = "round";

        App.socket = io.connect('http://localhost:4000');

        App.socket.on('connect', function() {
            App.socket.on('users_count', function(data) {
                $(document.getElementById(data)).css({
                    'margin-left': '',
                    '-webkit-border-radius': '3px',
                    '-moz-border-radius': '3px',
                    'border-radius': '3px',
                    'background': 'linear-gradient(to bottom, rgba(255,255,255,1) 11%,rgba(260,167,200,.1) 100%)'
                });

                currentSwitch.push(data);
            });
        });

        // Recieves, retrieves drawing done by another client. 
        // Without this listener responding from our server, the only drawing would be done by the client.

        App.socket.on('draw', function(data) {

            $(document.getElementById(data.x)).css({
                'margin-left': '',
                '-webkit-border-radius': '3px',
                '-moz-border-radius': '3px',
                'border-radius': '3px',
                'background': 'linear-gradient(to bottom, rgba(255,255,255,1) 11%,rgba(260,167,200,.1) 100%)'
            });

            // background-color: rgba(216, 236, 251, .5);

            var y = currentSwitch.pop();

            if (y === data.x) {
                $(document.getElementById(y)).css({
                    'margin-left': '',
                    '-webkit-border-radius': '',
                    '-moz-border-radius': '',
                    'border-radius': '',
                    'background': ''
                });
            } else {
                $(document.getElementById(y)).css({
                    'margin-left': '',
                    '-webkit-border-radius': '',
                    '-moz-border-radius': '',
                    'border-radius': '',
                    'background': ''
                });
                currentSwitch.push(data.x);
            }
            // alert("currentSwitch: " + currentSwitch);

            var red = Math.floor(255 * Math.random());
            var green = Math.floor(255 * Math.random());
            var blue = Math.floor(255 * Math.random());
            var rgb = "rgb(" + red + "," + green + "," + blue + ")";
            console.log(rgb);
            App.ctx.fillStyle = rgb;
            App.ctx.fillRect(0, 0, 150, 37.5);
        });

        // The next blocks of code allows the application to interact with jquery-event-drag implementation.
        // jquery-event-drag script performs the math for the drawing to canvas.

        // Sends drawing to clients's canvas
        // Rewrite comments in CanvasDraw-Sam!! Stuff below calls actions to Canvas element, not necessarily to jquery.event.drag !!! 
        // Important to know. If that's the case, how to jquery.event.drag and the canvas element interact with each other ???

        // remember, this function's x argument is not directly related to the below function's x argument!!
        App.draw = function(x) {

            $(document.getElementById(x)).css({
                'margin-left': '',
                '-webkit-border-radius': '3px',
                '-moz-border-radius': '3px',
                'border-radius': '3px',
                'background': 'linear-gradient(to bottom, rgba(255,255,255,1) 11%,rgba(260,167,200,.1) 100%)'
            });

            // background-color: rgba(216, 236, 251, .5);

            var y = currentSwitch.pop();

            if (y === x) {
                $(document.getElementById(y)).css({
                    'margin-left': '',
                    '-webkit-border-radius': '',
                    '-moz-border-radius': '',
                    'border-radius': '',
                    'background': ''
                });
            } else {
                $(document.getElementById(y)).css({
                    'margin-left': '',
                    '-webkit-border-radius': '',
                    '-moz-border-radius': '',
                    'border-radius': '',
                    'background': ''
                });
                currentSwitch.push(x);
            }
            // alert("currentSwitch: " + currentSwitch);

            var red = Math.floor(255 * Math.random());
            var green = Math.floor(255 * Math.random());
            var blue = Math.floor(255 * Math.random());
            var rgb = "rgb(" + red + "," + green + "," + blue + ")";
            console.log(rgb);
            App.ctx.fillStyle = rgb;
            App.ctx.fillRect(0, 0, 150, 37.5);
        };
    };
    /*
    Draw Events
  */
    $(document).ready(function() { // this is the fucking cunt that made it WORK!!!!
        $('.menu').on('click', 'div', function(e) {
            //console.log(e.currentTarget.id);
            var x = e.currentTarget.id;
            var z = currentSwitch;

            //console.log(y);
            // Later on.. Make an object with an array of colors. input these as a parameter to currentSwitch.
            // Not another index, but a parameter that exists with in the same index as x (currentSwitch[0])
            //var z = currentSwitch;
            //console.log(currentSwitch);

            // Check ordering of x and y. Notice App.draw, above... if (x) might cause issues ?
            // Can the function be triggered before y arrives, thus becoming trunked off ?
            // Send/apply client drawing to canvas
            App.draw(x);
            // Send/apply client drawing to server's canvas
            App.socket.emit('drawClick', { // drawClick will appear as "data" in the reception of this function, as seen in server.js
                x: x,
                z: z
            });
        });
    });

    // anonymous function that calls init upon startup. Only called once. (?)
    $(function() {
        return App.init();
    });

}).call(this);
