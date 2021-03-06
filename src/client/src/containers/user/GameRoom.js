import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { 
  handleClick, 
  jumpTo, 
  highlight, 
  changeResult,
  sort, 
  changeBoardSize,
  getRoomDetail
} from '../../actions/user/game';
import GameRoom from '../../pages/user/GameRoom';

const mapStateToProps = function(state) {
  return {
    room: state.game.room,
    player: state.game.player,
    didFindWinner: state.game.didFindWinner,
    result: state.game.result,
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
      changeResult,
      sort,
      changeBoardSize,
      getRoomDetail
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameRoom);