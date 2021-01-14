import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { 
  handleClick, 
  jumpTo, 
  highlight, 
  changeResult,
  changeGamePlay
} from '../../actions/user/game-review';
import GameReview from '../../pages/user/GameReview';

const mapStateToProps = function(state) {
  return {
    didFindWinner: state.gameReview.didFindWinner,
    result: state.gameReview.result,
    col: state.gameReview.col,
    row: state.gameReview.row,
    history: state.gameReview.history,
    isAsc: state.gameReview.isAsc,
    stepNumber: state.gameReview.stepNumber,
    xIsNext: state.gameReview.xIsNext
  };
}

const mapDispatchToProps = function(dispatch) {
  return {
    actions: bindActionCreators({
      handleClick,
      jumpTo,
      highlight,
      changeResult,
      changeGamePlay
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameReview);