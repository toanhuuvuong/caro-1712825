import systemConstant from '../../config/constant';
import authorizationService from '../../services/authorization';

export function actionHandleClick(history, stepNumber, xIsNext) {
  return {
    type: systemConstant.ACTION_TYPES.GAME.CLICK,
    history: history,
    stepNumber: stepNumber,
    xIsNext: xIsNext
  }
};

export function handleClick(socket, roomId, fields) {
  return dispatch => {
    socket.emit('update game state', {
      roomId: roomId, 
      fields: fields
    }, () => {
      dispatch(actionHandleClick(fields.history, fields.stepNumber, fields.xIsNext));
    });
  };
};

export function actionJumpTo(result, didFindWinner, stepNumber, xIsNext) {
  return {
    type: systemConstant.ACTION_TYPES.GAME.JUMP_TO,
    result: result,
    didFindWinner: didFindWinner,
    stepNumber: stepNumber,
    xIsNext: xIsNext
  }
};

export function jumpTo(socket, roomId, fields) {
  return dispatch => {
    socket.emit('update game state', {
      roomId: roomId, 
      fields: fields
    }, () => {
      dispatch(actionJumpTo(fields.result, fields.didFindWinner, fields.stepNumber, fields.xIsNext));
    });
  };
};

export function actionHighlight(result, didFindWinner, history) {
  return {
    type: systemConstant.ACTION_TYPES.GAME.HIGHT_LIGHT,
    result: result,
    didFindWinner: didFindWinner,
    history: history
  }
};

export function highlight(socket, roomId, fields) {
  return dispatch => {
    socket.emit('update game state', {
      roomId: roomId, 
      fields: fields
    }, () => {
      dispatch(actionHighlight(fields.result, fields.didFindWinner, fields.history));
    });
  };
};

export function actionChangeResult(result, didFindWinner) {
  return {
    type: systemConstant.ACTION_TYPES.GAME.CHANGE_RESULT,
    result: result,
    didFindWinner: didFindWinner,
  }
};

export function changeResult(socket, roomId, fields) {
  return dispatch => {
    socket.emit('update game state', {
      roomId: roomId, 
      fields: fields
    }, () => {
      dispatch(actionChangeResult(fields.result, fields.didFindWinner));
    });
  };
};

export function actionSort(history, isAsc) {
  return {
    type: systemConstant.ACTION_TYPES.GAME.SORT,
    history: history,
    isAsc: isAsc
  }
};

export function sort(socket, roomId, fields) {
  return dispatch => {
    socket.emit('update game state', {
      roomId: roomId, 
      fields: fields
    }, () => {
      dispatch(actionSort(fields.history, fields.isAsc));
    });
  };
};

export function actionChangeBoardSize(col, row) {
  return {
    type: systemConstant.ACTION_TYPES.GAME.CHANGE_BOARD_SIZE,
    col: col,
    row: row
  }
};

export function changeBoardSize(socket, roomId, fields) {
  return dispatch => {
    socket.emit('update game state', {
      roomId: roomId, 
      fields: fields
    }, () => {
      dispatch(actionChangeBoardSize(fields.col, fields.row));
    });
  };
};

export function actionGetRoomDetail(room) {
  return {
    type: systemConstant.ACTION_TYPES.GAME.GET_ROOM_DETAIL,
    room: room
  }
};

export function actionGetPlayer(room) {
  return {
    type: systemConstant.ACTION_TYPES.GAME.GET_PLAYER,
    player: authorizationService.getPlayer(room)
  }
};

export function actionChangeGameState(gameState) {
  const {col, row, history, isAsc, stepNumber, xIsNext, didFindWinner, result} = gameState;
  return {
    type: systemConstant.ACTION_TYPES.GAME.CHANGE_GAME_STATE,
    col: col,
    row: row,
    history: history,
    isAsc: isAsc,
    stepNumber: stepNumber,
    xIsNext: xIsNext,
    didFindWinner: didFindWinner,
    result: result
  }
};

export function getRoomDetail(socket, roomId) {
  return dispatch => {
    socket.emit('get room detail', roomId);
    socket.on('get room detail', room => {
      if(room && room.gameState) {
        dispatch(actionGetRoomDetail(room));
        dispatch(actionGetPlayer(room));
        dispatch(actionChangeGameState(room.gameState));
      } else {
        window.open(systemConstant.CLIENT_URL + '/dashboard', '_self')
      }
    });
  };
};