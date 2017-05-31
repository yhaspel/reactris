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

  advanceRow = (res) => {
    this.board.advanceBoard(res);
  }

  render() {
    return (
      <div>
        <h1>ReacTris</h1>
        <div>
          Play Tetris!
        </div>
        <Timer onTimeChange={this.advanceRow} ref={instance => { this.timer = instance; }}/>
        <div>
          <Board onTimerStop={this.stopTimer} ref={instance => { this.board = instance; }}/>
        </div>
      </div>
    );

  }
  
}

export default App;
