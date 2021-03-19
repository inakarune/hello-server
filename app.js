var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


const port = 7777;
const server = http.createServer(app).listen(port, () => {
    console.log('connect!!!' + port);
});
var io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ["GET", "POST"],
        credentials: true
    }});

io.on('connection', function(socket) {
    var room;
    var connected = [];
    var idx = 0;
    
    socket.on('create_room', function (data) {console.log(11111, data)
        socket.join(data.room);
        room = data.room;
        io.emit('all', { list: Array.from(io.sockets.adapter.rooms.keys()) });
        io.emit('create_room', {});
    });

    socket.on('login', function(data) {
        console.log(socket.id)
        io.emit('login', data.name);
    });

    socket.on('all', function(data) {
        io.emit('all', { list: Array.from(io.sockets.adapter.rooms.keys()) });
    });

    socket.on('enter_user', (data) => {console.log('enter_user,', data);
        socket.join(data.room);
        socket.name = data.name;
        io.to(data.room).emit('enter_user', data);
        connected[idx] = { name: data.name, socket: socket };
        idx++;
        console.log(connected)
    });

    socket.on('msg', (data) => {
        io.to(data.room).emit('msg', data);
    });
    socket.on('disconnect', function(data) {
        socket.leave(room);
    });
});
module.exports = app;
