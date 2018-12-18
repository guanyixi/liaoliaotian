var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(process.env.PORT || 4000);

// Varialbles
var users = [];

// Static files
app.use(express.static('public'));

// Socket setup on the server side (need to be setup on front-end in chat.js)
var io = socket(server); //server is the server we created earlier.

// When connection is made, fire socket function. Socket variable is each individual socket.
io.on('connection', function(socket){

    console.log('made socket connection', socket.id);

    // Update users when user disconnect, emit to all sockets
    socket.on('disconnect', function(data){
        // When user disconnect, remove the disconnected user from array. 
        users.splice(users.indexOf(socket.user), 1);
        // Emit the changes of "all users".
        updateUsers();
    });

    // Update users when new user connect, emit to all sockets
    socket.on('user', function(data){
        // When getting user data, push it to users array.
        users.push(data);
        // Add new user to socket.user - will use this for disconnection.
        socket.user = data;
        // Emit the changes of "all users".
        updateUsers();
    });

    // Helper: Emit "all users"
    function updateUsers(){
        io.sockets.emit('all users', users);
    }

    // Emit chat to all sockets
    socket.on('chat', function(data){
        //Sending the data to all sockets.
        io.sockets.emit('chat', data);
    });

});



