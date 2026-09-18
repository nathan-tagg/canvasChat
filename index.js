const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(server);
// Chat messages are appended as HTML on the client, so anything a user types
// has to be escaped here before it goes out to everyone.
const ESCAPES = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESCAPES[c]);
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit("Start_Chat");
  socket.on("Register_Name", function(data) {
    console.log("Received request to register name");
    var name = esc(data);
    io.emit("msg", "<strong>"+name+"</strong> Has joined the chat");
    console.log("Registered name is: " + name);
    socket.on("Send_msg", function(data) {
      io.emit("msg","<strong>"+name+": </strong>" + esc(data));
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
