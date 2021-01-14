import systemConstant from '../../config/constant';

export function actionHandleClick(history, stepNumber, xIsNext) {
  return {
    type: systemConstant.ACTION_TYPES.GAME_REVIEW.CLICK,
    history: history,
    stepNumber: stepNumber,
    xIsNext: xIsNext
  }
};

export function handleClick(fields) {
  return dispatch => {
    dispatch(actionHandleClick(fields.history, fields.stepNumber, fields.xIsNext));
  };
};

export function actionJumpTo(result, didFindWinner, stepNumber, xIsNext) {
  return {
    type: systemConstant.ACTION_TYPES.GAME_REVIEW.JUMP_TO,
    result: result,
    didFindWinner: didFindWinner,
    stepNumber: stepNumber,
    xIsNext: xIsNext
  }
};

export function jumpTo(fields) {
  return dispatch => {
    dispatch(actionJumpTo(fields.result, fields.didFindWinner, fields.stepNumber, fields.xIsNext));
  };
};

export function actionHighlight(result, didFindWinner, history) {
  return {
    type: systemConstant.ACTION_TYPES.GAME_REVIEW.HIGHT_LIGHT,
    result: result,
    didFindWinner: didFindWinner,
    history: history
  }
};

export function highlight(fields) {
  return dispatch => {
    dispatch(actionHighlight(fields.result, fields.didFindWinner, fields.history));
  };
};

export function actionChangeResult(result, didFindWinner) {
  return {
    type: systemConstant.ACTION_TYPES.GAME_REVIEW.CHANGE_RESULT,
    result: result,
    didFindWinner: didFindWinner,
  }
};

export function changeResult(fields) {
  return dispatch => {
    dispatch(actionChangeResult(fields.result, fields.didFindWinner));
  };
};

export function actionChangeGamePlay(history, col, row, didFindWinner) {
  return {
    type: systemConstant.ACTION_TYPES.GAME_REVIEW.CHANGE_GAME_PLAY,
    history: history,
    col: col,
    row: row,
    didFindWinner: didFindWinner,
  }
};
export function changeGamePlay(fields) {
  return dispatch => {
    dispatch(actionChangeGamePlay(fields.history, fields.col, fields.row, fields.didFindWinner));
  };
};