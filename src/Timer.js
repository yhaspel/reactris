import React, { Component } from 'react';

let STARTING_INTERVAL = 200;
let STARTING_LEVEL_ADVANCE_TICKS = 100;

export class Timer extends Component {
  constructor() {
    super();
    this.startTimer();
  }

  shortenInterval() {
    let fivePercent = Math.floor(this.interval / 20);
    this.interval = Math.max(10, this.interval - fivePercent);
  }

  startTimer() {
    this.counter = 0;
    this.interval = STARTING_INTERVAL;
    this.levelAdvanceTicks = STARTING_LEVEL_ADVANCE_TICKS;
    this.level = 1;
    this.intervalId = setInterval(() => {
      this.setState({counter: this.counter++});
      if (this.counter === this.levelAdvanceTicks) {
        this.shortenInterval();
        this.level++;
        this.levelAdvanceTicks = this.levelAdvanceTicks * this.level;
      }
      this.props.onTimeChange(this.counter);
    }, this.interval);
  }

  stopTimer() {
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <span>Level:{this.level}</span>
    );
  }
}