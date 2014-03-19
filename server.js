(function() {
  var io;
  var serverSwitch;

  io = require('socket.io').listen(4000);
  io.sockets.on('connection', function(socket) {
    
    //console.log(serverSwitch);
    socket.emit('users_count', serverSwitch);    
    socket.on('disconnect', function () {
    });   

    socket.on('drawClick', function(data) {
      // Sent to clients


      serverSwitch = data.x;

      //console.log(data.x)
      socket.broadcast.emit('draw', {
        x: data.x,
      });
    });

  });
}).call(this); //why this? also seen in scripts.js
