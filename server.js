let express = require("express");
let path = require("path");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);

let poll = require('./poll');
let port = 8080;

app.use("/", express.static(path.join(__dirname, "dist/lab11")));

// Client connects to server vis socket.io
io.on("connection", socket => {
  console.log("New connection made from client with ID: " + socket.id);
  
  // Update new client with all poll data
  socket.emit("initVoteUpdate", poll);

  // If there is a new vote, update all clients with updated poll data
  socket.on("newVote", voteSelected => {
    poll.options[voteSelected].count += 1
    io.sockets.emit("voteUpdate", poll);
  });

});

server.listen(port, () => {
  console.log("Listening on port " + port);
});