import { combineReducers } from 'redux';
import gameReducer from './user/game';

const reducer = combineReducers({
  game: gameReducer
});

export default reducer;