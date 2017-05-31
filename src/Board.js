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

  detectBottomCollision() {
    let collision = false;
      // check last row collistion here. consider removing all 0 row 
    for (let i=0; i<this.currentTetrimino.dotArray.length-1; i++) {
      for (let j=0; j<this.currentTetrimino.dotArray[i].length; j++) {
        if (!!this.currentTetrimino.dotArray[i][j]
        && !!!this.currentTetrimino.dotArray[i+1][j]) { // and no block under in the same tetriminos (Thus ensuring the last block from bottom)
          // collision with bottom of board
          if (this.currentTetrimino.coordinates.i+i+1 >= this.state.boardArray.length) {
            return true;
          }
          // collision with another brick
          if (!!this.state.boardArray[this.currentTetrimino.coordinates.i+i+1][this.currentTetrimino.coordinates.j+j]){
            if (this.currentTetrimino.coordinates.i === 0) {
              this.setState({mode: 'game over'});
              this.props.onTimerStop(this.counter);
              alert('GAME OVER!');
            }
            return true;
          }
        }
      }
    }
    return collision;
  }

  advanceTetriminos = () => {
    if (!this.detectBottomCollision()) {
      this.clearCurrentTetrimino();
      this.currentTetrimino.advanceYCoords();
    } else {
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
      if (this.currentTetrimino.coordinates.j > 0
        && !!!this.state.boardArray[this.currentTetrimino.coordinates.i][this.currentTetrimino.coordinates.j-1]) {
        this.currentTetrimino.coordinates.j--;
      }
      this.setBoardWithTetriminos();
  }

  handleRotateClick(e) {
      this.clearCurrentTetrimino();
      this.currentTetrimino.rotate();
      this.setBoardWithTetriminos();
  }

  handleRightClick(e) {
      this.clearCurrentTetrimino();
      if (this.currentTetrimino.coordinates.j + this.currentTetrimino.getRightmostIndex() < this.state.boardArray[0].length
        && !!!this.state.boardArray[this.currentTetrimino.coordinates.i][this.currentTetrimino.coordinates.j+1]) {
        this.currentTetrimino.coordinates.j++;
      }
      this.setBoardWithTetriminos();
  }

  render() {
    return (
      <div onKeyDown={this.handleKeyPress}>
        <div>
          Score:{ this.state.score }
        </div>
        <button onClick={(e) => this.handleLeftClick(e)}>{LEFT}</button>
        <button onClick={(e) => this.handleRotateClick(e)}>{ROTATE}</button>
        <button onClick={(e) => this.handleRightClick(e)}>{RIGHT}</button>
        <div className="tetris-board">
            <table>
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
        </div>
      </div>
    );
  }

}