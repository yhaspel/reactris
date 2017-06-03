import React, { Component } from 'react';

let STARTING_INTERVAL = 400;
let STARTING_LEVEL_ADVANCE_TICKS = 100;
let tempInterval = STARTING_INTERVAL;

export class Timer extends Component {
  constructor() {
    super();
    this.startTimer();
  }

  shortenInterval() {
    let fivePercent = Math.floor(this.interval / 20);
    this.interval = Math.max(10, this.interval - fivePercent);
    this.stopTimer();
    this.intervalId = setInterval(() => {
      this.setState({counter: this.counter++});
      if (this.counter >= this.levelAdvanceTicks) {
        this.shortenInterval();
        this.level++;
        this.levelAdvanceTicks = this.levelAdvanceTicks * this.level;
      }
      this.props.onTimeChange(this.counter);
    }, this.interval);
  }

  restartTimer() {
    this.stopTimer();
    this.startTimer();
  }

  startTimer() {
    this.counter = 0;
    this.interval = STARTING_INTERVAL;
    this.levelAdvanceTicks = STARTING_LEVEL_ADVANCE_TICKS;
    this.level = 1;
    this.intervalId = setInterval(() => {
      this.setState({counter: this.counter++});
      if (this.counter >= this.levelAdvanceTicks) {
        this.shortenInterval();
        this.level++;
        this.levelAdvanceTicks = this.levelAdvanceTicks * this.level;
      }
      this.props.onTimeChange(this.counter);
    }, this.interval);
  }

  setTempTimerInterval(interval) {
    tempInterval = this.interval;
    this.interval = interval;
    this.stopTimer();
    this.intervalId = setInterval(() => {
      this.setState({counter: this.counter++});
      if (this.counter >= this.levelAdvanceTicks) {
        this.shortenInterval();
        this.level++;
        this.levelAdvanceTicks = this.levelAdvanceTicks * this.level;
      }
      this.props.onTimeChange(this.counter);
    }, this.interval);
  }

  restoreTimerInterval() {
    this.interval = tempInterval;
    this.stopTimer();
    this.intervalId = setInterval(() => {
      this.setState({counter: this.counter++});
      if (this.counter >= this.levelAdvanceTicks) {
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
      <span><h4>Level:{this.level}</h4></span>
    );
  }
}