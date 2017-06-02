import React, { Component } from 'react';
import { TetriminoI, TetriminoJ, TetriminoL, TetriminoO, TetriminoS, TetriminoT, TetriminoZ } from './Tetriminos.js';

let BOARD_WIDTH = 12;
let BOARD_HEIGHT = 24;
let LEFT = '<<';
let RIGHT = '>>';
let ROTATE = '@';

export class Board extends Component {
  constructor() {
    super();
    this.height = BOARD_HEIGHT;
    this.width = BOARD_WIDTH;
    this.currentTetrimino = null;
    this.state = {
      score: 0,
      mode: 'new',
      boardArray: this.getBaseBoardArray(BOARD_HEIGHT, BOARD_WIDTH)
    };
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

  detectRightCollision() {
      let coords = this.getRightCoords();
      for (let coord of coords) { 
        let i = coord.i;
        let j = coord.j;
        if (j+1 >= BOARD_WIDTH
        || !!this.state.boardArray[i][j+1]) {
          return true;
        }
      }
      return false;
  }

  getRightCoords() {
    let coords = [];
    for(let i=0; i<this.currentTetrimino.dotArray.length; i++) {
      for(let j=this.currentTetrimino.dotArray[0].length-1; j>=0; j--) {
        if (!!this.currentTetrimino.dotArray[i][j]) { 
          coords.push(
            {
              i: (i + this.currentTetrimino.coordinates.i), 
              j: (j + this.currentTetrimino.coordinates.j)              
            }
          );
          continue;
        }
      }
    }
    return coords;
  }

  detectLeftCollision() {
      let coords = this.getLeftCoords();

      for (let coord of coords) { 
        let i = coord.i;
        let j = coord.j;
        if (j <= 0
        || !!this.state.boardArray[i][j-1]) {
          return true;
        }
      }
      return false;
  }

  getLeftCoords() {
    let coords = [];
    for(let i=0; i<this.currentTetrimino.dotArray.length; i++) {
      for(let j=0; j<this.currentTetrimino.dotArray[0].length; j++) {
        if (!!this.currentTetrimino.dotArray[i][j]) {
          coords.push(
            {
              i: (i + this.currentTetrimino.coordinates.i), 
              j: (j + this.currentTetrimino.coordinates.j)              
            }
          );
          continue;
        }
      }
    }
    return coords;
  }

  detectBottomCollision() {
      let coords = this.getBottomCoords();

      for (let coord of coords) { 
        let i = coord.i;
        let j = coord.j;
        if (i+1 >= this.state.boardArray.length
        || !!this.state.boardArray[i+1][j]) {
          return true;
        }
      }
      return false;
  }

  getBottomCoords() {
    let coords = [];

    for(let j=0; j< this.currentTetrimino.dotArray[0].length; j++) {
      for(let i=0; i< this.currentTetrimino.dotArray.length; i++) {
        if (!!this.currentTetrimino.dotArray[i][j] 
        && !!!this.currentTetrimino.dotArray[i+1][j]) {
          coords.push(
            {
              i: (i + this.currentTetrimino.coordinates.i), 
              j: (j + this.currentTetrimino.coordinates.j)              
            }
          );
        }
      }
    }
    return coords;
  }

  advanceTetriminos = () => {
    if (!this.detectBottomCollision()) {
      this.clearCurrentTetrimino();
      this.currentTetrimino.advanceYCoords();
    } else {
      if (this.currentTetrimino.coordinates.i === 0) {
        this.setState({mode: 'game over'});
        this.props.onTimerStop(this.counter);
        alert('GAME OVER!');
      }
      if (this.state.mode !== 'game over') {
        this.setState({mode: 'bottom collision'});
      }
    }
  }

  setCurrentTetrimino() {
    // TODO fetch from teteriminos queue when implemented
    this.currentTetrimino = this.getRandomTetrimino(); 
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
    var board = this.state.boardArray.concat();
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

  getRandomTetrimino() {
    var random = Math.floor((Math.random() * 7) + 1);
    switch(random) {
      case 1: return new TetriminoI();
      case 2: return new TetriminoJ();
      case 3: return new TetriminoL();
      case 4: return new TetriminoO();
      case 5: return new TetriminoS();
      case 6: return new TetriminoT();
      case 7: return new TetriminoZ();
      default: throw new Error("Error selecting Teteriminos");
    }
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
      this.clearCurrentTetrimino();
      if (!this.detectLeftCollision()) {
        this.currentTetrimino.coordinates.j--;
      }
      this.setBoardWithTetriminos();
  }

  handleRotateClick(e) {
      this.setState({mode: 'rotation'});
      this.clearCurrentTetrimino();
      this.currentTetrimino.rotate();
      this.setBoardWithTetriminos();
  }

  handleRightClick(e) {
      this.clearCurrentTetrimino();
      if (!this.detectRightCollision()) {
        this.currentTetrimino.coordinates.j++;
      }
      this.setBoardWithTetriminos();
  }

  render() {
    return (
      <div>
        <div className="tetris-board">
          <div className="bg">
            <div>
              Score:{ this.state.score }
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
            </div>
          </div>
        </div>
      </div>
    );
  }

}