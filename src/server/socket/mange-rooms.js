const systemConstant = require('../config/constant');

/*const rooms = [
  {id: null, xPlayer: null, oPlayer: null, viewers: [], gameState: {}, chatMessages: []}
];*/
const rooms = [];

const isInAnyRooms = function(userId) {
  for(const room of rooms) {
    if(room.xPlayer && room.xPlayer.id === userId) { // User is xPlayer
      return room;
    } 
    if (room.oPlayer && room.oPlayer.id === userId) { // User is oPlayer
      return room;
    } 
    const iViewer = room.viewers.findIndex(function(item) {
      return item.id === userId
    });
    if(iViewer !== -1) { // User is viewer
      return room;
    }
  }
  return null;
};

const isInOtherRooms = function(userId, roomId) {
  const room = isInAnyRooms(userId);
  return (room && room.id !== roomId); 
};

module.exports = {
  joinRoom: function(roomId, user, settings) {
    if(!user || isInOtherRooms(user.id, roomId)) {
      return null;
    }
    const iRoom = rooms.findIndex(function(item) {
      return item.id === roomId
    });
    if (iRoom !== -1) {
      const room = rooms[iRoom];

      if(room.type === 'private' && room.password !== settings.password) {
        return null;
      }

      // Find xPlayer
      if(!room.xPlayer) {
        room.xPlayer = user;
        return room;
      }
      // User is xPlayer
      if(room.xPlayer.id === user.id) {
        return room;
      }
      // Find oPlayer
      if(!room.oPlayer) {
        room.oPlayer = user;
        return room;
      }
      // User is oPlayer
      if(room.oPlayer.id === user.id) {
        return room;
      }
      const iViewer = room.viewers.findIndex(function(item) {
        return item.id === user.id
      });

      if(iViewer !== -1) {
        room.viewers[iViewer] = user;
        return room;
      }
      room.viewers.push(user);
      return room;
    }
    const {type, password, timeout} = settings;
    const newRoom = {
      id: user.id + Date.now(), 
      name: '#' + (rooms.length + 1),
      type: type,
      password: password,
      timeout: parseInt(timeout),
      didStartXTimer: false,
      didStartOTimer: false,
      didSetXInterval: false,
      didSetOInterval: false,
      xPlayer: user, 
      oPlayer: null,
      viewers: [],
      gameState: {
        col: systemConstant.gameStateDefault.COL,
        row: systemConstant.gameStateDefault.ROW,
        history: [{
          move: 0,
          squares: Array(systemConstant.gameStateDefault.COL * systemConstant.gameStateDefault.ROW).fill(null),
          location: null
        }],
        isAsc: true,
        stepNumber: 0,
        xIsNext: true,
        didFindWinner: false,
        result: null
      },
      chatMessages: [],
      createdDate: Date.now(),
      xIsReady: false,
      oIsReady: false,
    };
    rooms.push(newRoom);
    return newRoom;
  },
  leaveRoom: function(roomId, userId) {
    if(!userId) {
      return null;
    }
    const iRoom = rooms.findIndex(function(item) {
      return item.id === roomId
    });
    if (iRoom !== -1) {
      const room = rooms[iRoom];
      if(room.xPlayer && room.xPlayer.id === userId) { // User is xPlayer
        // Has only one Player
        if(!room.oPlayer) {
          rooms.splice(iRoom, 1);
        } else {
          room.xPlayer = null;
        }
        return room;
      } 
      if (room.oPlayer && room.oPlayer.id === userId) { // User is oPlayer
        // Has only one Player
        if(!room.xPlayer) {
          rooms.splice(iRoom, 1);
        } else {
          room.oPlayer = null;
        }
        return room;
      }
      const iViewer = room.viewers.findIndex(function(item) {
        return item.id === userId
      });
      if(iViewer !== -1) { // User is viewer
        room.viewers.splice(iViewer, 1);
        return room;
      }
    }
    return null;
  },
  leaveRooms: function(userId) {
    if(!userId) {
      return null;
    }
    const length = rooms.length;
    for(let iRoom = 0; iRoom < length; iRoom++) {
      const room = rooms[iRoom];
      if(room.xPlayer && room.xPlayer.id === userId) { // User is xPlayer
        // Has only one Player
        if(!room.oPlayer) {
          rooms.splice(iRoom, 1);
        } else {
          room.xPlayer = null;
        }
        return room;
      }
      if (room.oPlayer && room.oPlayer.id === userId) { // User is oPlayer
        // Has only one Player
        if(!room.xPlayer) {
          rooms.splice(iRoom, 1);
        } else {
          room.oPlayer = null;
        }
        return room;
      }
      const iViewer = room.viewers.findIndex(function(item) {
        return item.id === userId
      });
      if(iViewer !== -1) { // User is viewer
        room.viewers.splice(iViewer, 1);
        return room;
      }
    }
    return null;
  },
  getRoomById: function(roomId) {
    const iRoom = rooms.findIndex(function(item) {
      return item.id === roomId
    });
    if (iRoom !== -1) {
      return rooms[iRoom];
    }
    return null;
  },
  getRoomByUserId: function(userId) {
    return isInAnyRooms(userId);
  },
  updateGameState(roomId, fields) {
    const iRoom = rooms.findIndex(function(item) {
      return item.id === roomId
    });
    if(iRoom !== -1) {
      const gameState = rooms[iRoom].gameState;

      const {col, row, history, isAsc, stepNumber, xIsNext, didFindWinner, result} = fields;

      if(col !== undefined) {
        gameState.col = col;
      }
      if(row !== undefined) {
        gameState.row = row;
      }
      if(history !== undefined) {
        gameState.history = history;
      }
      if(isAsc !== undefined) {
        gameState.isAsc = isAsc;
      }
      if(stepNumber !== undefined) {
        gameState.stepNumber = stepNumber;
      }
      if(xIsNext !== undefined) {
        gameState.xIsNext = xIsNext;
      }
      if(didFindWinner !== undefined) {
        gameState.didFindWinner = didFindWinner;
      }
      if(result !== undefined) {
        gameState.result = result;
      }
      return rooms[iRoom];
    }
    return null;
  },
  getRooms: function() {
    return rooms;
  },
  addNewMessage: function(roomId, message) {
    const iRoom = rooms.findIndex(function(item) {
      return item.id === roomId
    });
    if(iRoom !== -1) {
      const chatMessages = rooms[iRoom].chatMessages;
      chatMessages.push(message);
      return message;
    }
    return null;
  },
  getMessages: function(roomId) {
    const iRoom = rooms.findIndex(function(item) {
      return item.id === roomId
    });
    if(iRoom !== -1) {
      return rooms[iRoom].chatMessages;
    }
    return null;
  },
  getTimeout: function(roomId, isXPlayer) {
    const iRoom = rooms.findIndex(function(item) {
      return item.id === roomId
    });
    if(iRoom !== -1) {
      if((isXPlayer && !rooms[iRoom].didStartXTimer) ||
        (!isXPlayer && !rooms[iRoom].didStartOTimer)) {
        //rooms[iRoom].didStartXTimer = true;
        return rooms[iRoom].timeout;
      }
    }
    return null;
  },
  getDidStartTimer: function(roomId, isXPlayer) {
    const iRoom = rooms.findIndex(function(item) {
      return item.id === roomId
    });
    if(iRoom !== -1) {
      if(isXPlayer) {
        return rooms[iRoom].didStartXTimer;
      } else {
        return rooms[iRoom].didStartOTimer;
      }
    }
    return null;
  },
  getDidSetInterval: function(roomId, isXPlayer) {
    const iRoom = rooms.findIndex(function(item) {
      return item.id === roomId
    });
    if(iRoom !== -1) {
      if(isXPlayer) {
        return rooms[iRoom].didSetXInterval;
      } else {
        return rooms[iRoom].didSetOInterval;
      }
    }
    return null;
  },
  setDidSetInterval: function(roomId, isXPlayer, value) {
    const iRoom = rooms.findIndex(function(item) {
      return item.id === roomId
    });
    if(iRoom !== -1) {
      if(isXPlayer) {
        rooms[iRoom].didSetXInterval = value;
      } else {
        rooms[iRoom].didSetOInterval = value;
      }
    }
  },
  startTimer: function(roomId, isXPlayer, intervalId) {
    const iRoom = rooms.findIndex(function(item) {
      return item.id === roomId
    });
    if(iRoom !== -1) {
      if(isXPlayer) {
        rooms[iRoom].didStartXTimer = intervalId;
      } else {
        rooms[iRoom].didStartOTimer = intervalId;
      }
    }
  },
  stopTimer: function(roomId, isXPlayer) {
    const iRoom = rooms.findIndex(function(item) {
      return item.id === roomId
    });
    if(iRoom !== -1) {
      console.log('STOP TIMER ' + (isXPlayer ? 'X' : 'O'));
      if(isXPlayer) {
        //clearInterval(rooms[iRoom].didStartXTimer);
        rooms[iRoom].didStartXTimer = false;
      } else {
        //clearInterval(rooms[iRoom].didStartOTimer);
        rooms[iRoom].didStartOTimer = false;
      }
    }
  },
  setIsReady: function(roomId, isXPlayer, value) {
    const iRoom = rooms.findIndex(function(item) {
      return item.id === roomId
    });
    if(iRoom !== -1) {
      if(isXPlayer) {
        rooms[iRoom].xIsReady = value;
      } else {
        rooms[iRoom].oIsReady = value;
      }
    }
  },
  getIsReady: function(roomId, isXPlayer) {
    const iRoom = rooms.findIndex(function(item) {
      return item.id === roomId
    });
    if(iRoom !== -1) {
      if(isXPlayer) {
        return rooms[iRoom].xIsReady;
      } else {
        return rooms[iRoom].oIsReady;
      }
    }
    return null;
  },
  getAreReady: function(roomId) {
    const iRoom = rooms.findIndex(function(item) {
      return item.id === roomId
    });
    if(iRoom !== -1) {
      return rooms[iRoom].xIsReady && rooms[iRoom].oIsReady;
    }
    return null;
  },
  updatePlayer: function(roomId, isXPlayer, model) {
    const iRoom = rooms.findIndex(function(item) {
      return item.id === roomId
    });
    if(iRoom !== -1) {
      if(isXPlayer) {
        rooms[iRoom].xPlayer = model;
      } else {
        rooms[iRoom].oPlayer = model;
      }
    }
  }
}