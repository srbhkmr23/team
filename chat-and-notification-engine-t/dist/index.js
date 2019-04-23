'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _chatModel = require('./chat/chatModel');

var _chatModel2 = _interopRequireDefault(_chatModel);

var _dbConnection = require('./db/dbConnection');

var _dbConnection2 = _interopRequireDefault(_dbConnection);

var _serverConfig = require('./config/serverConfig');

var _serverConfig2 = _interopRequireDefault(_serverConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cors = require('cors');
var app = (0, _express2.default)();
var bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.get('/', function (req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  var resultStr = JSON.stringify("Teamium chat server is running.");
  res.write(resultStr);
  res.end();
});
var httpObj = _http2.default.Server(app);
var io = (0, _socket2.default)(httpObj);
var users = {};
var clients = 0;

io.on('connection', function (socket) {
  clients++;
  // console.log('---------------new connection------------')
  // console.log("socket",socket.id)
  // console.log("socket.handshake.query['id']  ",socket.handshake.query['id'])
  //  console.log("new connection")
  if (socket.handshake.query['id'] in users) {
    //User has second socket
    users[socket.handshake.query['id']].push(socket.id);
  } else {
    users[socket.handshake.query['id']] = [];
    users[socket.handshake.query['id']].push(socket.id);
  }

  // console.log("users",users)

  //  users[socket.handshake.query['id']]=socket.id;


  socket.broadcast.emit('newconnection', { 'onlineUserList': users });

  //  io.to( users[socket.handshake.query['id']] ).emit('newconnection', {'onlineUserList':users});
  io.to(socket.id).emit('newconnection', { 'onlineUserList': users });

  socket.on('sendMessage', function (data) {
    _chatModel2.default.addMessageInDb(data);
    var newDataObject = {
      message_from: data.from,
      message_to: data.to,
      message: data.msg,
      message_send_time: new Date()

      //  io.to(users[data.to]).emit('getMessage', newDataObject);
      //  io.to(users[data.from]).emit('getMessage', newDataObject);

    };try {
      // send message to all connected recevers with same id
      if (users[data.to] && users[data.to].length > 0) {
        users[data.to].forEach(function (socketId) {
          io.to(socketId).emit('getMessage', newDataObject);
        });
      }

      // send message to all connected senders with same id
      if (users[data.from] && users[data.from].length > 0) {
        users[data.from].forEach(function (socketId) {
          io.to(socketId).emit('getMessage', newDataObject);
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on('getAllMessage', function (data) {
    _chatModel2.default.getAllMessage(data, function (list) {
      io.to(data.socketId).emit('getAllMessage', list);
    });

    //  io.to(users[data.from]).emit('getAllMessage', []);
  });

  socket.on('setUserIsTyping', function (data) {

    // send typing message to all connected recevers with same id
    if (users[data.to] && users[data.to].length > 0) {
      users[data.to].forEach(function (socketId) {
        io.to(socketId).emit('getUserIsTyping', data);
      });
    }

    // io.to(users[data.to]).emit('getUserIsTyping', data);

  });

  socket.on('getAllMessageNotifications', function (data) {
    _chatModel2.default.getAllMessageNotifications(data, function (list) {
      io.to(data.socketId).emit('setAllMessageNotifications', list);
    });
  });

  socket.on('setMessageSeenByUser', function (data) {
    _chatModel2.default.setMessageSeenByUser(data, function (list) {
      //  console.log("list",list)
    });
  });

  socket.on('offline', function (logOutData) {

    try {
      var userId = logOutData.userId;
      var socketId = logOutData.socketId;
      if (userId in users) {
        var tempList = users[userId] || [];
        var index = tempList.indexOf(socketId);
        // find all connected user with single id and remove that
        if (index > -1) {
          tempList.splice(index, 1);
          if (tempList.length == 0) {
            delete users[userId];
            socket.broadcast.emit('newconnection', { 'onlineUserList': users });
          } else {
            users[userId] = tempList;
          }
        }
        // if(tempList.length>0){}
      }
      // clients--;
      // delete users[userId];
      // socket.broadcast.emit('newconnection',{'onlineUserList':users});
      // console.log("offline")
      // console.log("users",users)
    } catch (err) {
      console.log(err);
    }
  });

  socket.on('disconnect', function () {
    clients--;
    socket.broadcast.emit('newUserConnect', { description: clients + ' clients connected!', 'onlineUserList': users });
  });
});

httpObj.listen(_serverConfig2.default.port, _serverConfig2.default.host, function () {
  console.log('listening on localhost:' + _serverConfig2.default.port);
});