import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import chatModel from './chat/chatModel';
import dbconnection from './db/dbConnection';
import serverConfig from './config/serverConfig';
var cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.get('/', (req, res) => {
  res.writeHead(200, {"Content-Type": "application/json"});
  let resultStr = JSON.stringify("Teamium chat server is running.");
  res.write(resultStr);
  res.end();
})
const httpObj = http.Server(app);
const io = socketIO(httpObj);
let users={};
let clients = 0;

io.on('connection', function(socket) {
   clients++;
   // console.log('---------------new connection------------')
   // console.log("socket",socket.id)
   // console.log("socket.handshake.query['id']  ",socket.handshake.query['id'])
  //  console.log("new connection")
   if(socket.handshake.query['id'] in users) {
      //User has second socket
      users[socket.handshake.query['id']].push(socket.id)
    } else {
      users[socket.handshake.query['id']]=[];
      users[socket.handshake.query['id']].push(socket.id)
    }

    // console.log("users",users)
   
  //  users[socket.handshake.query['id']]=socket.id;


   socket.broadcast.emit('newconnection',{'onlineUserList':users});
    
  //  io.to( users[socket.handshake.query['id']] ).emit('newconnection', {'onlineUserList':users});
  io.to( socket.id ).emit('newconnection', {'onlineUserList':users});

  socket.on('sendMessage', function(data){
     chatModel.addMessageInDb(data);
     let newDataObject = {
      message_from:data.from,
      message_to:data.to,
      message:data.msg,
      message_send_time:new Date()
     }

    //  io.to(users[data.to]).emit('getMessage', newDataObject);
    //  io.to(users[data.from]).emit('getMessage', newDataObject);

    try{
      // send message to all connected recevers with same id
      if(users[data.to] && users[data.to].length>0){
        users[data.to].forEach(socketId => {
          io.to(socketId).emit('getMessage', newDataObject);
        });
      }

      // send message to all connected senders with same id
      if(users[data.from] && users[data.from].length>0){
        users[data.from].forEach(socketId => {
          io.to(socketId).emit('getMessage', newDataObject);
        });
      }
    }
    catch(err){
      console.log(err)
    }
  });

  socket.on('getAllMessage', function(data){
     chatModel.getAllMessage(data,(list)=>{
      io.to(data.socketId).emit('getAllMessage', list);
    });

    //  io.to(users[data.from]).emit('getAllMessage', []);
  });

  socket.on('setUserIsTyping', function(data){

    // send typing message to all connected recevers with same id
    if(users[data.to] && users[data.to].length>0){
      users[data.to].forEach(socketId => {
        io.to(socketId).emit('getUserIsTyping', data);
      });
    }


    // io.to(users[data.to]).emit('getUserIsTyping', data);


  });

  socket.on('getAllMessageNotifications', function(data){
    chatModel.getAllMessageNotifications(data,(list)=>{
      io.to(data.socketId).emit('setAllMessageNotifications', list);
     });
  });

  socket.on('setMessageSeenByUser', function(data){
    chatModel.setMessageSeenByUser(data,(list)=>{
    //  console.log("list",list)
    });
  });

  socket.on('offline',  (logOutData) =>{

    try{
      let userId =logOutData.userId;
      let socketId = logOutData.socketId;
      if(userId in users) {
        let tempList=users[userId] || [];
        let index = tempList.indexOf(socketId);
        // find all connected user with single id and remove that
        if(index>-1){
          tempList.splice(index,1);
          if(tempList.length==0){
            delete users[userId];
            socket.broadcast.emit('newconnection',{'onlineUserList':users});
          }
          else{
            users[userId]=tempList;
          }
        }
        // if(tempList.length>0){}
      }
        // clients--;
        // delete users[userId];
        // socket.broadcast.emit('newconnection',{'onlineUserList':users});
        // console.log("offline")
        // console.log("users",users)
    }
    catch(err){
      console.log(err)
    }

  });

  socket.on('disconnect', function () {
      clients--;
      socket.broadcast.emit('newUserConnect',{ description: clients + ' clients connected!','onlineUserList':users})
  });
});

httpObj.listen(serverConfig.port,serverConfig.host, function() {
   console.log(`listening on localhost:${serverConfig.port}`);
});
