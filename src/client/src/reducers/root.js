import { combineReducers } from 'redux';
import gameReducer from './user/game';
import gameReviewReducer from './user/game-review';

const reducer = combineReducers({
  game: gameReducer,
  gameReview: gameReviewReducer
});

export default reducer;