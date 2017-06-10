import React, { Component } from 'react';
import {detectCollision} from './CollisionDetetctionService.js';
import {LEFT, RIGHT, ROTATE, DOWN, BOARD_HEIGHT, BOARD_WIDTH} from './constants.js';
import {TetriminoStack} from './TetriminoStack.js'

export class Board extends Component {
  constructor() {
    super();
    this.currentTetrimino = null;
    this.state = {
      score: 0,
      mode: 'new',
      boardArray: this.getBaseBoardArray(BOARD_HEIGHT, BOARD_WIDTH)
    };
  }

  restartBoard() {
    this.currentTetrimino = null;
    this.setState({score: 0, mode: 'new', boardArray: this.getBaseBoardArray(BOARD_HEIGHT, BOARD_WIDTH)})
  }

  getCompletedRows() {
      let completedRowIndices = [];
      for (let rowIndex in this.state.boardArray) {
          let row = this.state.boardArray[rowIndex];
          let rowCompleted = row.every(function(cell) {
            return !!cell;
          });
          if (rowCompleted) {
              completedRowIndices.push(rowIndex);
          }
      }
      return completedRowIndices.length? completedRowIndices : false;
  }

  removeCompletedRows(completedRowIndices) {
    let newBoard = this.getBaseBoardArray();
    function getEmptyRow() {
        let row = [];
        for (let i=0; i<BOARD_WIDTH; i++) {
            row.push(false);
        }
        return row;
    }
    for (let rowIndex in this.state.boardArray) {
        let row = this.state.boardArray[rowIndex];
        if (completedRowIndices.indexOf(rowIndex) < 0) {
            newBoard.push(row);
        } else {
            newBoard.unshift(getEmptyRow());
        }
    }
    this.setState({boardArray: newBoard.concat()});
  }
  
  advanceBoard = (time) => {
    if (this.state.mode === 'bottom collision' || this.state.mode === 'new') {
      let completedRowIndices = this.getCompletedRows();
      if (completedRowIndices) {
        this.setState({time: time, score: this.state.score + 1000 * completedRowIndices.length});
        this.removeCompletedRows(completedRowIndices);
      }
      this.putNewTetriminoOnBoard();
      
    } else {
      this.advanceTetriminos();
    }
    this.setState({time: time, score: this.state.score + 10});
    this.setBoardWithTetriminos();
  }

  detectBottomCollision() {
    return detectCollision('bottom', this.state.boardArray, this.currentTetrimino);
  }

  detectLeftCollision() {
    return detectCollision('left', this.state.boardArray, this.currentTetrimino);
  }

  detectRightCollision() {
    return detectCollision('right', this.state.boardArray, this.currentTetrimino);
  }

  detectRotationCollisionAndAdjustCoords() {
    return detectCollision('rotate', this.state.boardArray, this.currentTetrimino);
  }
sta
  advanceTetriminos = () => {
    if (!this.detectBottomCollision()) {
      this.clearCurrentTetrimino();
      this.currentTetrimino.advanceYCoords();
    } else {
      if (this.currentTetrimino.coordinates.i === 0) {
        this.setState({mode: 'game over'});
        this.props.onGameOver(this.counter);
      }
      if (this.state.mode !== 'game over') {
        this.setState({mode: 'bottom collision'});
      }
    }
  }

  setCurrentTetrimino() {
    this.currentTetrimino = this.tetriminoStack.pop(); 
  }

  putNewTetriminoOnBoard = () => {
    this.setCurrentTetrimino();
    this.setState({mode: 'active'});
    this.currentTetrimino.coordinates.j = BOARD_WIDTH / 2 - 1;
    this.currentTetrimino.coordinates.i = 0;
  }

  clearCurrentTetrimino() {
    this.setBoardWithTetriminos(true);
  }

  setBoardWithTetriminos = (clear) => {
    let board = this.state.boardArray.concat();
    let tCoords = this.currentTetrimino.dotArray;
    for (let i=0; i<tCoords.length; i++) {
      for (let j=0; j<tCoords[i].length; j++) {
        if (tCoords[i][j]
          && this.state.boardArray.length > i + this.currentTetrimino.coordinates.i) { // only applying values > 0
          board[i + this.currentTetrimino.coordinates.i][j + this.currentTetrimino.coordinates.j] = clear? false : tCoords[i][j];  
        }
      }
    }
    this.setState({boardArray: board.concat()});
  }

  getBaseBoardArray(height, width) {
    let boardArr = [];
    for (let i=0; i<height; i++) {
      boardArr.push([]);
      for (let j=0; j<width; j++) { 
        boardArr[i].push(false);
      }
    }
    return boardArr;
  }

  handleLeftClick(e) {
      this.setState({mode: 'left'});
      this.clearCurrentTetrimino();
      if (!this.detectLeftCollision()) {
        this.currentTetrimino.coordinates.j--;
      }
      this.setBoardWithTetriminos();
  }

  handleRotateClick(e) {
      this.setState({mode: 'rotation'});
      this.clearCurrentTetrimino();
      this.detectRotationCollisionAndAdjustCoords()
      this.currentTetrimino.rotate();
      this.setBoardWithTetriminos();
  }

  handleRightClick(e) {
      this.setState({mode: 'right'});
      this.clearCurrentTetrimino();
      if (!this.detectRightCollision()) {
        this.currentTetrimino.coordinates.j++;
      }
      this.setBoardWithTetriminos();
  }

  handleDownMouseDown(e) {
    this.props.onDownHold();
  }

  handleDownMouseUp(e) {
    this.props.onDownRelease();
  }

  render() {
    return (
      <div className="tetris-board-outer">
        <div className="tetris-board">
          <div className="bg">
            <div>
              <h5>
                Score:{ this.state.score }
              </h5>
            </div>
            <table className="tetris-board-table">
                <tbody>
                    {this.state.boardArray.map(function(row, i) {
                    return (
                        <tr key={i}>
                        {row.map(function(col, j){
                            return (<td className="board-cell" key={j}><div className={col === 1? 'red': col === 2? 'gray': col === 3? 'purple' : col === 4 ? 'blue' : col === 5 ? 'green' : col === 6 ? 'brown' : col === 7 ? 'teal' : ''}>{col}</div></td>);
                        })}
                        </tr>
                    );
                    })}
                </tbody>
            </table>
            <div className="action-buttons-outer">
              <div className="action-buttons">
                <button disabled={this.state.mode === 'game over'} className="action-button" onClick={(e) => this.handleLeftClick(e)}>{LEFT}</button>
                <button disabled={this.state.mode === 'game over'} className="action-button" onClick={(e) => this.handleRotateClick(e)}>{ROTATE}</button>
                <button disabled={this.state.mode === 'game over'} className="action-button" onClick={(e) => this.handleRightClick(e)}>{RIGHT}</button>
              </div>
              <div className="action-buttons lower-buttons-row">
                <button disabled={this.state.mode === 'game over'} className="action-button" onMouseDown={(e) => this.handleDownMouseDown(e)} onMouseUp={(e) => this.handleDownMouseUp(e)}>{DOWN}</button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <TetriminoStack ref={instance => { this.tetriminoStack = instance; }}/>
        </div>
      </div>
    );
  }

}