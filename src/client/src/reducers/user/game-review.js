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
    case systemConstant.ACTION_TYPES.GAME_REVIEW.CLICK:
      return {
        ...state,
        history: action.history,
        stepNumber: action.stepNumber,
        xIsNext: action.xIsNext
      };
    case systemConstant.ACTION_TYPES.GAME_REVIEW.JUMP_TO:
      return {
        ...state,
        result: action.result,
        didFindWinner: action.didFindWinner,
        stepNumber: action.stepNumber,
        xIsNext: action.xIsNext
      };
    case systemConstant.ACTION_TYPES.GAME_REVIEW.HIGHT_LIGHT:
      return {
        ...state,
        result: action.result,
        didFindWinner: action.didFindWinner,
        history: action.history
      };
    case systemConstant.ACTION_TYPES.GAME_REVIEW.CHANGE_RESULT:
      return {
        ...state,
        result: action.result,
        didFindWinner: action.didFindWinner
      };
    case systemConstant.ACTION_TYPES.GAME_REVIEW.CHANGE_GAME_PLAY:
      return {
        ...state,
        history: action.history,
        col: action.col,
        row: action.row,
        didFindWinner: action.didFindWinner
      };
    default: 
      return state;
  }
};