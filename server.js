var http = require('http');
var io = require('socket.io').listen(15782), 
fs = require('fs'),
url = require('url');
var express = require('express');


var app = express.createServer();


app.configure(function () {
  
  app.use(express.static(__dirname + '/public'));
  

});

app.get("/", express.static(__dirname + '/public/'));

app.listen(15782);

var io = sio.listen(app);

io.sockets.on('connection', function (socket) {
  
  socket.broadcast.emit('newuser', {id: socket.id});
  
  var clients = io.sockets.clients();
  
  var clientIds = new Array();

  for(var client in clients) {  
    if(clients[client].id != socket.id){
      clientIds.push(clients[client].id);
    }
  }

  socket.emit('getconnected', { ids: clientIds});

  socket.on('usermove', function(moveData){
      
      socket.broadcast.emit('usermoved', {id: socket.id, x: moveData.x, y: moveData.y, direction: moveData.direction, Ydirection: moveData.Ydirection});

    });

  socket.on('disconnect', function(){
      socket.broadcast.emit('userleave',{id: socket.id});
  });
  

});

