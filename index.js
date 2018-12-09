const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(server);
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit("Start_Chat");
  socket.on("Register_Name", function(data) {
    console.log("Received request to register name");
    io.emit("msg", "<strong>"+data+"</strong> Has joined the chat");
    var name = data;
    console.log("Registered name is: " + name);
    socket.on("Send_msg", function(data) {
      io.emit("msg","<strong>"+name+": </strong>" + data);
    });
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    //io.emit("msg", "<strong>"+name+"</strong> Has left the chat");
  });

  socket.on("draw", function(prevX, prevY, currX, currY, x, y) {
    io.emit("color", prevX, prevY, currX, currY, x, y);
  });
});
