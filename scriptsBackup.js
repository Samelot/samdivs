(function() {
  var App;
  App = {};
  /*
  	Init 
  */
  App.init = function() {
    App.canvas = document.createElement('canvas');
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

    var cars = 'Saab,Volvo,BMW,GMC,Nissan,Ford'.split(',');
    for (var c in cars) {
      bob = document.createElement('div');
      bob.id = cars[c]; bob.className = "car";
      bob.innerHTML = cars[c];
      App.docfrag.appendChild(bob);
      //document.body.appendChild(newElement);
    }

    App.canvas.height = 400;
    App.canvas.width = 800;
    // Creates canvas inside article tag/element.
    document.getElementsByTagName('article')[0].appendChild(App.canvas);
    document.getElementsByTagName('article')[0].appendChild(App.docfrag);
    App.ctx = App.canvas.getContext("2d");
    App.ctx.fillStyle = "solid";
    App.ctx.strokeStyle = "#ECD018";
    App.ctx.lineWidth = 5;
    App.ctx.lineCap = "round";
    App.socket = io.connect('http://localhost:4000');
    // Recieves, retrieves drawing done by another client. 
    // Without this listener responding from our server, the only drawing would be done by the client.
    App.socket.on('draw', function(data) {
      // When recieved, this data triggers to App.draw.
      // Send/apply server drawings (other clients beside user) to canvas

      // What handles client/server interaction so that user drawing doesn't recieve repeat of what he drew, if such repetitions are possible?
      return App.draw(data.x); // left out ", data.param1, data.param2"
    });

    // The next blocks of code allows the application to interact with jquery-event-drag implementation.
    // jquery-event-drag script performs the math for the drawing to canvas.

    // Sends drawing to clients's canvas
    // Rewrite comments in CanvasDraw-Sam!! Stuff below calls actions to Canvas element, not necessarily to jquery.event.drag !!! 
    // Important to know. If that's the case, how to jquery.event.drag and the canvas element interact with each other ???
    
    App.draw = function(x) {
      if (x) {
        $(App.docfrag).css('background-color', 'blue');
        $(App.canvas).css('background-color', 'blue');
      } 
    };
  };
  /*
  	Draw Events
  */
  $('div').live('click', function(e) {
    //$(e.target).css('background-color', 'blue');
    console.log(e);
    console.log(x);
    var x;
    // Send/apply client drawing to canvas
    App.draw(e);
    // Send/apply client drawing to server's canvas
    App.socket.emit('drawClick', { // drawClick will appear as "data" in the reception of this function, as seen in server.js
      x: x,
    });
  });

  // anonymous function that calls init upon startup. Only called once. (?)
  $(function() {
    return App.init();
  });

}).call(this);
