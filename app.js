const express = require("express")
const nunjucks = require("nunjucks")

var app = express()

var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use('/socket-io',
    express.static('node_modules/socket.io-client/dist'));
app.get('/', function (request, response) {
    response.render('chat.html');
});
io.on('connection', function (client) {
    console.log('CONNECTED');
    client.on('join-room', function (room) {
        client.join(room, function () {
            console.log(client.rooms);
            io.to(room).emit('chat-msg', '**new user joined**');
        });
        client.on('incoming', function (msg) {
            io.to(msg.room).emit('chat-msg', msg.msg);
        });
    });
    // client.on('incoming', function (msg) {
    //     io.emit('chat-msg', msg);
    // });

    client.on('disconnect', function () {
        console.log('EXITED');
    });
});
http.listen(8000, function () {
    console.log('Listening on port 8000')
});