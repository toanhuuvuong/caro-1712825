import React, { useEffect, useContext, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input, Col, Row } from 'reactstrap';

import matchAPI from '../../../api/user/match';
import moveAPI from '../../../api/user/move';
import GamePlayReview from '../../../containers/user/GamePlayReview';
import Breadcrumbs from '../../../components/user/Breadcrumbs';
import GameInfo from './GameInfo';
import GameTabs from './GameTabs';

function GameReview({col, row, history, isAsc, stepNumber, xIsNext, didFindWinner, result, actions}) {
  // --- Params
  const { matchId } = useParams();
  const [match, setMatch] = useState({});

  // --- Effect hook
  useEffect(() => {
    matchAPI.getById(matchId)
    .then(data => {
      if (data.ok) {
        setMatch(data.item);
        console.log(data.item._id);
        moveAPI.getByMatchId(matchId)
        .then(data1 => {
          if(data1.ok) {
            // config history
            const newHistory = [...data1.items];
            newHistory.map((item, index) => {
              const squares = Array(data.item.colBoard * data.item.rowBoard).fill(null);
              for(let i = 0; i <= index; i++) {
                if(i % 2 === 0) {
                  squares[newHistory[i].location] = {value: 'O', isHighlight: false};
                } else {
                  squares[newHistory[i].location] = {value: 'X', isHighlight: false};
                };
              }

              newHistory[index] = {
                ...item, 
                squares: squares
              };
            });

            const fields = {
              history: newHistory,
              col: data.item.colBoard,
              row: data.item.rowBoard
            }
            actions.changeGamePlay(fields);
          }
        });
      }
    });
  }, []);

  return(
    <div>
      <Breadcrumbs currentItem="Game review" />
      <div className="game-room">
        <Row>
          <Col lg={7} className="game-play">
            <hr />
            <GamePlayReview />
            <hr />
          </Col>
          <Col lg={5} className="game-settings">
            <hr />
            {match && <GameInfo match={match} />}
            <hr />
            <GameTabs col={col} 
            row={row}
            history={history} 
            isAsc={isAsc} 
            stepNumber={stepNumber}
            xIsNext={xIsNext}
            didFindWinner={didFindWinner}
            actions={actions} /> 
            <hr />  
          </Col>
        </Row>
      </div>      
    </div>
  );
}

export default GameReview;