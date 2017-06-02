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

  showAboutHelpAlert() {
    let message = 'ReactJS implementation of a tetris game. written by Yuval Haspel.'
    let keys = [
      'Keys:',
      '<< - move left',
      '@  - rotate tetrimino',
      '> - move right'
    ];
    alert(message + '\n' + keys.join('\n'));
  }

  render() {
    return (
      <div>
        <div onClick={this.showAboutHelpAlert} className="header-outer">
          <div className="bg">
            <h1>Tetris</h1>
            <h5>by Yuval Haspel</h5>
            <Timer onTimeChange={this.advanceRow} ref={instance => { this.timer = instance; }}/>
          </div>
        </div>
        <div>
          <Board onTimerStop={this.stopTimer} ref={instance => { this.board = instance; }}/>
        </div>
      </div>
    );

  }
  
}

export default App;
