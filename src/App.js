import React, { Component } from 'react';
import { Timer } from './Timer.js';
import { Board } from './Board.js';
import './App.css';

var tempInterval;

class App extends Component {
  constructor(props) {
    super(props);
    this.holdDown = false;
    this.state = {
      time: 0
    };
  }

  stopTimer = (temp) => {
    this.timer.stopTimer();
    this.timer.setRunMode(false);
    alert('GAME OVER!');
  }

  downHold = () => {
    if (!this.holdDown) {
      this.holdDown = true;
      tempInterval = this.timer.getInterval();
      this.timer.setInterval(20);
    }
  }

  downRelease = () => {
    this.holdDown = false;
    this.timer.setInterval(tempInterval);
  }

  advanceRow = (res) => {
    this.board.advanceBoard(res);
  }

  showHelpAlert() {
    let message = `
      Controls
      --------
      
      Buttons:
      << - move left
      @  - rotate tetrimino
      >  - move right
      V  - advance downwards faster

      Keyboard Controls (Numpad / Arrow keys):
      4 / Left Arrow - move left
      5 / Up Arrow - rotate tetrimino
      6 / Right Arrow - move right
      2 / Down Arrow - advance downwards faster
    `;

    alert(message);
  }

  showAboutAlert() {
    let message = `
      ReactJS implementation of a tetris game. written by Yuval Haspel.
    `;

    alert(message);
  }

  handleRestart(e) {
    this.board.restartBoard();
    this.timer.setRunMode(true);
    this.timer.restartTimer();
  }

  handleKeyUp = (e) => {
    switch(e.key) {
      case '2':
      case 'ArrowDown':
        this.downRelease();
        break;
      default: break;
    }
  }

  handleKeyDown = (e) => {
    switch(e.key) {
      case '2':
      case 'ArrowDown':
        this.downHold();
        break;
      case '5':
      case 'ArrowUp':
        this.board.handleRotateClick();
        break;
      case '4':
      case 'ArrowLeft':
        this.board.handleLeftClick();
        break;
      case '6':
      case 'ArrowRight':
        this.board.handleRightClick();
        break;
      default: break;
    }
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  render() {
    return (
      <div>
        <div className="header-outer">
          <div className="bg">
            <h1>Tetris</h1>
            <a href="http://www.github.com/yhaspel/reactris" target="_blank">View Source Code on GitHub</a>
            <div className="restart-button-section">
              <button className="restart-button" onClick={(e) => this.handleRestart(e)}>Restart Game</button>
              <button className="about-button" onClick={(e) => this.showAboutAlert(e)}>About</button>
              <button className="help-button" onClick={(e) => this.showHelpAlert(e)}>Help</button>
            </div>
            <Timer onIntervalTick={this.advanceRow} ref={instance => { this.timer = instance; }}/>
          </div>
        </div>
        <div autoFocus>
          <Board onGameOver={this.stopTimer} onDownHold={this.downHold} onDownRelease={this.downRelease} ref={instance => { this.board = instance; }}/>
        </div>
        <div>
        </div>
      </div>
    );

  }
  
}

export default App;
