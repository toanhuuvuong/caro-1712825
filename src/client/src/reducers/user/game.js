import systemConstant from '../../config/constant';

const initState = {
  result: null,
  didFindWinner: false,
  col: systemConstant.GAME_STATE_DEFAULT.COL,
  row: systemConstant.GAME_STATE_DEFAULT.ROW,
  history: [{
    move: 0,
    squares: Array(systemConstant.GAME_STATE_DEFAULT.COL * systemConstant.GAME_STATE_DEFAULT.ROW).fill(null),
    location: null
  }],
  isAsc: true,
  stepNumber: 0,
  xIsNext: true
};

export default function(state = initState, action) {
  switch(action.type) {
    case systemConstant.ACTION_TYPES.GAME.CLICK:
      return {
        ...state,
        history: action.history,
        stepNumber: action.stepNumber,
        xIsNext: action.xIsNext
      };
    case systemConstant.ACTION_TYPES.GAME.JUMP_TO:
      return {
        ...state,
        result: action.result,
        didFindWinner: action.didFindWinner,
        stepNumber: action.stepNumber,
        xIsNext: action.xIsNext
      };
    case systemConstant.ACTION_TYPES.GAME.HIGHT_LIGHT:
      return {
        ...state,
        result: action.result,
        didFindWinner: action.didFindWinner,
        history: action.history
      };
    case systemConstant.ACTION_TYPES.GAME.CHANGE_RESULT:
      return {
        ...state,
        result: action.result,
        didFindWinner: action.didFindWinner
      };
    case systemConstant.ACTION_TYPES.GAME.SORT:
      return {
        ...state,
        history: action.history,
        isAsc: action.isAsc
      };
    case systemConstant.ACTION_TYPES.GAME.CHANGE_BOARD_SIZE:
      return {
        ...state,
        result: null,
        didFindWinner: false,
        col: action.col,
        row: action.row,
        history: [{
          move: 0,
          squares: Array(action.col * action.row).fill(null),
          location: null
        }],
        isAsc: true,
        stepNumber: 0,
        xIsNext: true
      };
    case systemConstant.ACTION_TYPES.GAME.GET_ROOM_DETAIL:
      return {
        ...state,
        room: action.room
      };
    case systemConstant.ACTION_TYPES.GAME.GET_PLAYER:
      return {
        ...state,
        player: action.player
      };
    case systemConstant.ACTION_TYPES.GAME.CHANGE_GAME_STATE:
      return {
        ...state,
        result: action.result,
        didFindWinner: action.didFindWinner,
        col: action.col,
        row: action.row,
        history: action.history,
        isAsc: action.isAsc,
        stepNumber: action.stepNumber,
        xIsNext: action.xIsNext
      };
    default: 
      return state;
  }
};