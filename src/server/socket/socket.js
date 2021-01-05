const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

const manageOnlineUsers = require('./mange-online-users');
const manageRooms = require('./mange-rooms');
const formatMessage = require('./format-message');

module.exports = function(server) {
  const io = socketIO(server, {
    cors: {
      credentials: true,
      origin: process.env.CLIENT_URL
    }
  });
  
  io.use(function(socket, next) { // Middleware serialize user
    const token = socket.handshake.auth.token;
    console.log('Token:', token);
    
    if(token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decodedToken) {
        if (err) { 
          throw err;
        }
        socket.request.user = decodedToken;
        return next();
      });
    } else {
      return next();
    }
  });

  io.on('connection', function(socket) {
    console.log('New Socket:', socket.id, '------------------');

    const user = socket.request.user; // Serialize user

    // --- Add new user online
    if(user && manageOnlineUsers.addUser(user)) {
      console.log(' ++ New Online User:', user.name);
      console.log(' ++ Number of User Onlines:', manageOnlineUsers.getOnlineUsers().length);

      // Update list online users
      io.emit('online users', manageOnlineUsers.getOnlineUsers());
    }

    // --- Get list rooms
    socket.on('get rooms', function() {
      if(user) {
        console.log(' ++ Get Rooms by:', user.username);

        // Send list rooms
        socket.emit('get rooms', manageRooms.getRooms());
      }
    });

    // --- Get room info
    socket.on('get room detail', function(roomId) {
      if(user) {
        console.log(' ++', user.username, 'go to Room:', roomId);
        const room = manageRooms.getRoomById(roomId);
        if(room) {
          const userRoom = manageRooms.getRoomByUserId(user.id);
          if(userRoom && userRoom.id === roomId) {
            socket.join(roomId); // socket join
          }

          // Send room info
          socket.emit('get room detail', room);
        }
      }
    });

    // --- Create new room
    socket.on('create room', function({userId, type, password, timeout}, callback) {
      if(user && user.id === userId) {
        const settings = {
          type: type, 
          password: password, 
          timeout: timeout
        };
        const newRoom = manageRooms.joinRoom(null, user, settings);
        if(newRoom) {
          console.log(' ++ New Room by:', user.username);
          socket.join(newRoom.id); // socket join
          // Update list rooms
          io.emit('get rooms', manageRooms.getRooms());

          callback({ok: true, messageCode: 'create_room_success', item: newRoom});
        } else {
          callback({ok: false, messageCode: 'create_room_fail'});
        }
      } else {
        callback({ok: false, messageCode: 'create_room_fail'});
      }
    });

    // --- Join room
    socket.on('join room', function({userId, roomId, password}, callback) {
      if(user && user.id === userId) {
        const settings = {
          password: password
        };
        console.log('Password:', password)
        const room = manageRooms.joinRoom(roomId, user, settings);
        if(room) {
          console.log(' ++', user.username, 'joined Room:', roomId);
          socket.join(roomId); // socket join

          // Wellcome new user
          // socket.emit('get message', formatMessage(user.username, 'Wellcome to room ' + roomId + '!'));

          // Broardcast when user join room
          manageRooms.addNewMessage(roomId, formatMessage(user, user.username + ' has joined the room!'));
          socket.broadcast.to(roomId).emit('get messages', manageRooms.getMessages(roomId));

          // Update list rooms
          io.emit('get rooms', manageRooms.getRooms());

          // Update room info
          io.to(roomId).emit('get room detail', manageRooms.getRoomById(roomId));

          callback({ok: true, messageCode: 'join_room_success', item: room});
        } else {
          callback({ok: false, messageCode: 'join_room_fail', item: manageRooms.getRoomById(roomId)});
        }
      } else {
        callback({ok: false, messageCode: 'join_room_fail'});
      }
    });

    // --- Update game state
    socket.on('update game state', ({roomId, fields}, callback) => {
      if(user) {
        const room = manageRooms.updateGameState(roomId, fields);
        if(room) {
          console.log(user.username, 'updated Game State:', roomId);
          console.log(user.username, 'updated Fields:', fields);

          socket.broadcast.to(roomId).emit('get room detail', room);
        }
        callback();
      }
    });
    
    // --- Chat message
    socket.on('chat message', function({roomId, content}, callback) {
      if(user) {
        console.log(' ++', user.username, 'new Chat Message:', content);
        if(content) {
          const userRoom = manageRooms.getRoomByUserId(user.id);
          if(userRoom && userRoom.id === roomId) {
            socket.join(roomId); // socket join
          }

          const message = manageRooms.addNewMessage(roomId, formatMessage(user, content));

          if(message) {
            // Notify has new message
            io.to(roomId).emit('get messages', manageRooms.getMessages(roomId));
          }

          callback();
        }
      }
    });

    socket.on('get messages', function(roomId) {
      if(user) {
        if(roomId) {
          const userRoom = manageRooms.getRoomByUserId(user.id);
          if(userRoom && userRoom.id === roomId) {
            socket.join(roomId); // socket join
          }

          const messages = manageRooms.getMessages(roomId);

          if(messages) {
            // Notify has new message
            socket.emit('get messages', messages);
          }
        }
      }
    });

    // --- User leave room
    socket.on('leave room', function({roomId, userId}, callback) {
      if(user && user.id === userId) {
        const room = manageRooms.leaveRoom(roomId, userId);
        if(room) {
          console.log(' ++', user.username , 'left Room:', roomId);

          // Broardcast when user leave room
          manageRooms.addNewMessage(roomId, formatMessage(user, user.username + ' has left the room!'));
          socket.broadcast.to(roomId).emit('get messages', manageRooms.getMessages(roomId));

          // Update list rooms
          io.emit('get rooms', manageRooms.getRooms());

          // Update room info
          io.to(roomId).emit('get room detail', manageRooms.getRoomById(room.id));

          callback({ok: true, messageCode: 'leave_room_success', item: room});
        } else {
          callback({ok: false, messageCode: 'leave_room_fail'});
        }
      }
    });

    // --- User invite
    socket.on('invite', function({from, to, room}) {
      if(user && user.id === from) {
        if(room && !manageRooms.getRoomByUserId(to)) {
          // Broardcast
          socket.broadcast.emit('receive invition', {from: user, to: to, room: room});
        } 
      }
    });

    // --- User logout
    socket.on('logout', function(userId, callback) {
      if(user && user.id === userId 
        && manageOnlineUsers.removeUser(userId)) {
        console.log(' ++ Remove Online User:', user.username);
        console.log(' ++ Number of User Onlines:', manageOnlineUsers.getOnlineUsers().length);

        // Update list online users
        io.emit('online users', manageOnlineUsers.getOnlineUsers());

        const room = manageRooms.leaveRooms(userId);
        if(room) {
          console.log(' ++', user.username , 'left Room:', room.id);

          // Broardcast when user leave room
          manageRooms.addNewMessage(room.id, formatMessage(user, user.username + ' has left the room!'))
          socket.broadcast.to(room.id).emit('get messages', manageRooms.getMessages(roomId));

          // Update list rooms
          io.emit('get rooms', manageRooms.getRooms());

          // Update room info
          io.emit('get room detail', manageRooms.getRoomById(room.id));
        }
      }
      callback();
    });
    
    // --- User disconnect
    socket.on('disconnect', function() {
      if(user && manageOnlineUsers.removeUser(user.id)) {
        console.log(' ++ Remove Online User:', user.username);
        console.log(' ++ Number of User Onlines:', manageOnlineUsers.getOnlineUsers().length);

        // Update online users
        io.emit('online users', manageOnlineUsers.getOnlineUsers());
      }
    });
  });
};