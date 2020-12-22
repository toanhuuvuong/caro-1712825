import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { 
  handleClick, 
  jumpTo, 
  highlight, 
  sort, 
  changeBoardSize,
  getRoomDetail
} from '../../actions/user/game';
import Game from '../../components/user/Game';

const mapStateToProps = function(state) {
  return {
    room: state.game.room,
    player: state.game.player,
    didFindWinner: state.game.didFindWinner,
    col: state.game.col,
    row: state.game.row,
    history: state.game.history,
    isAsc: state.game.isAsc,
    stepNumber: state.game.stepNumber,
    xIsNext: state.game.xIsNext
  };
}

const mapDispatchToProps = function(dispatch) {
  return {
    actions: bindActionCreators({
      handleClick,
      jumpTo,
      highlight,
      sort,
      changeBoardSize,
      getRoomDetail
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);