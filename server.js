(function() {
  var io;
  var serverSwitch;

  io = require('socket.io').listen(4000);
  io.sockets.on('connection', function(socket) {
    
    //console.log(serverSwitch);
    socket.emit('users_count', serverSwitch);    
    socket.on('disconnect', function () {});   

    socket.on('drawClick', function(data) {
      // Sent to clients
      serverSwitch = data.x;

      socket.broadcast.emit('draw', {
        x: data.x,
      });
    });

  });
}).call(this); //why this? also seen in scripts.js

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = 8080;
 
http.createServer(function(request, response) {
  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }
 
    if (fs.statSync(filename).isDirectory()) filename += '/index.html';
 
    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }
 
      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(port);
