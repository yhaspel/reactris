import React, { Component } from 'react';
import { Timer } from './Timer.js';
import { Board } from './Board.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
  }

  stopTimer = () => {
    this.timer.stopTimer();
  }

  downHold = () => {
    this.timer.setTempTimerInterval(10);
  }

  downRelease = () => {
    this.timer.restoreTimerInterval();
  }

  advanceRow = (res) => {
    this.board.advanceBoard(res);
  }

  showAboutHelpAlert() {
    let message = 'ReactJS implementation of a tetris game. written by Yuval Haspel.'
    let keys = [
      'Keys:',
      '<< - move left',
      '@  - rotate tetrimino',
      '>  - move right',
      'V  - advance downwards faster'
    ];
    alert(message + '\n' + keys.join('\n'));
  }

  handleRestart(e) {
    this.board.restartBoard();
    this.timer.restartTimer();
  }

  render() {
    return (
      <div>
        <div className="header-outer">
          <div className="bg">
            <h1 title="click here for help" onClick={this.showAboutHelpAlert} >Tetris</h1>
            <h5>by Yuval Haspel</h5>
            <div className="restart-button-section">
              <button className="restart-button" onClick={(e) => this.handleRestart(e)}>Restart Game</button>
            </div>
            <Timer onTimeChange={this.advanceRow} ref={instance => { this.timer = instance; }}/>
          </div>
        </div>
        <div>
          <Board onTimerStop={this.stopTimer} onDownHold={this.downHold} onDownRelease={this.downRelease} ref={instance => { this.board = instance; }}/>
        </div>
      </div>
    );

  }
  
}

export default App;
