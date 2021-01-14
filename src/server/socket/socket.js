const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

const manageOnlineUsers = require('./mange-online-users');
const manageRooms = require('./mange-rooms');
const formatMessage = require('./format-message');
const userBUS = require('../bus/user');

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
        userBUS.findById(decodedToken.id)
        .then(function(user) {
          if(user) {
            const payload = {
              id: user._id.toString(),
              username: user.username,
              name: user.name,
              avatar: user.avatar,
              trophies: user.trophies,
              win: user.win,
              lost: user.lost,
              total: user.total,
              role: user.role
            };
            socket.request.user = payload;
            return next();
          }
        })
        .catch(function(err) {
          console.trace(err);
        });
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
            // Send room info
            socket.emit('get room detail', room);
          } else {
            socket.emit('get room detail', null);
          }
        } else {
          socket.emit('get room detail', null);
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
          manageRooms.addNewMessage(roomId, formatMessage(user, user.name + ' has joined the room!'));
          socket.broadcast.to(roomId).emit('get messages', manageRooms.getMessages(roomId));

          // Update list rooms
          io.emit('get rooms', manageRooms.getRooms());

          // Update room info
          io.to(roomId).emit('get room detail', manageRooms.getRoomById(roomId));

          callback({ok: true, messageCode: 'join_room_success', item: room});
        } else {
          callback({ok: false, messageCode: 'wrong_password'});
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
            const message = manageRooms.addNewMessage(roomId, formatMessage(user, content));

            if(message) {
              // Notify has new message
              io.to(roomId).emit('get messages', manageRooms.getMessages(roomId));
            }

            callback();
          }
        }
      }
    });

    socket.on('get messages', function(roomId) {
      if(user) {
        if(roomId) {
          const userRoom = manageRooms.getRoomByUserId(user.id);
          if(userRoom && userRoom.id === roomId) {
            socket.join(roomId); // socket join
            const messages = manageRooms.getMessages(roomId);

            if(messages) {
              // Notify has new message
              socket.emit('get messages', messages);
            }
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
          manageRooms.addNewMessage(roomId, formatMessage(user, user.name + ' has left the room!'));
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
          manageRooms.addNewMessage(room.id, formatMessage(user, user.name + ' has left the room!'))
          socket.broadcast.to(room.id).emit('get messages', manageRooms.getMessages(room.id));

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

    // --- Reset timer
    socket.on('reset timer', function({roomId, isXPlayer}) {
      let timeout = manageRooms.getTimeout(roomId, isXPlayer);
      if(timeout) {
        console.log('TIMEOUT:', timeout);
        const duration = 60 * timeout;
        let timer = duration;
        let minutes;
        let seconds;

        if(!manageRooms.getDidSetInterval(roomId, isXPlayer)) {
          manageRooms.setDidSetInterval(roomId, isXPlayer, true);
          
          const intervalId = setInterval(function() {
            if(manageRooms.getDidStartTimer(roomId, isXPlayer)) {
              if(timeout) {
                timeout = null;
                timer = duration;
                console.log('RESET TIMER ' + (isXPlayer ? 'X' : 'O'));
              } 
              console.log('RUNNING TIMER ' + (isXPlayer ? 'X' : 'O'));
              minutes = parseInt(timer / 60, 10);
              seconds = parseInt(timer % 60, 10);
  
              minutes = minutes < 10 ? '0' + minutes : minutes;
              seconds = seconds < 10 ? '0' + seconds : seconds;
  
              console.log('TIME:', minutes + ':' + seconds);
              io.to(roomId).emit('get timer ' + (isXPlayer ? 'X' : 'O'), {time: minutes + ':' + seconds});
  
              if (--timer < 0) {
                timer = duration;
                clearInterval(intervalId);
                manageRooms.stopTimer(roomId, isXPlayer);
                console.log('TIMEOUT ' + (isXPlayer ? 'X' : 'O'));
                io.to(roomId).emit('timeout', {isXPlayer: isXPlayer});
              }
            }
          }, 1000);
        }

        manageRooms.startTimer(roomId, isXPlayer, true);
      } else {
        io.to(roomId).emit('get timer ' + isXPlayer ? 'X' : 'O', {time: null});
      }
    });

    // --- Stop timer
    socket.on('stop timer', function({roomId, isXPlayer}) {
      manageRooms.stopTimer(roomId, isXPlayer);
    });

    // --- Ready
    socket.on('ready', function({roomId, isXPlayer}) {
      manageRooms.setIsReady(roomId, isXPlayer, true);
      io.to(roomId).emit('get ready ' + (isXPlayer ? 'X' : 'O'), {isReady: manageRooms.getIsReady(roomId, isXPlayer)});
      io.to(roomId).emit('get both ready', {areReady: manageRooms.getAreReady(roomId)});
    });

    // --- Update player info
    socket.on('update player info', function({roomId, isXPlayer, model}) {
      manageRooms.updatePlayer(roomId, isXPlayer, model);
      io.to(roomId).emit('get room detail', manageRooms.getRoomById(roomId));
    });

    // --- Quick play
    socket.on('quick play', function({userId}, callback) {
      if(user && user.id === userId) {
        const quickRoom = manageRooms.getQuickRoom(user);
        if(quickRoom) {
          const settings = {
            password: ''
          };
          const room = manageRooms.joinRoom(quickRoom.id, user, settings);
          if(room) {
            console.log(' ++', user.username, 'joined Room:', quickRoom.id);
            socket.join(quickRoom.id); // socket join

            // Wellcome new user
            // socket.emit('get message', formatMessage(user.username, 'Wellcome to room ' + roomId + '!'));

            // Broardcast when user join room
            manageRooms.addNewMessage(quickRoom.id, formatMessage(user, user.name + ' has joined the room!'));
            socket.broadcast.to(quickRoom.id).emit('get messages', manageRooms.getMessages(quickRoom.id));

            // Update list rooms
            io.emit('get rooms', manageRooms.getRooms());

            // Update room info
            io.to(quickRoom.id).emit('get room detail', manageRooms.getRoomById(quickRoom.id));

            callback({ok: true, messageCode: 'join_room_success', item: room});
          } else {
            callback({ok: false, messageCode: 'join_room_fail'});
          }
        } else {
          callback({ok: false, messageCode: 'wrong_password'});
        }
      } else {
        callback({ok: false, messageCode: 'join_room_fail'});
      }
    });
  });
};