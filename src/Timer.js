import React, { Component } from 'react';
import {PERCENTAGE_SPEED_INCREASE, MIN_INTERVAL, STARTING_INTERVAL, STARTING_LEVEL_ADVANCE_TICKS} from './constants.js';

export class Timer extends Component {
  constructor() {
    super();
    this.timers = [];
    this.runMode = true;
    this.startTimer();
  }

  getShortenedInterval(oldInterval) {
    let fivePercent = Math.floor(oldInterval / (100 / PERCENTAGE_SPEED_INCREASE));
    return Math.max(MIN_INTERVAL, oldInterval - fivePercent);
  }

  setInterval(interval) { 
    this.interval = interval;
  }

  setRunMode(val) {
    this.runMode = val;
  }

  getInterval() {
    return this.interval;
  }

  restartTimer()  {
    this.stopTimer();
    this.startTimer();
  }

  startTimer() {
    this.state = {
      counter: 0,
      level: 1
    }
    this.interval = STARTING_INTERVAL;
    this.levelAdvanceTicks = STARTING_LEVEL_ADVANCE_TICKS;
    this.setIntervalId();
  }

  setIntervalId() {
    let internalCallback = () => {
      if (!this.runMode) {
        return;
      }
      this.setState({counter: this.state.counter + 1});
      if (this.state.counter >= this.levelAdvanceTicks) {
        this.setState({level: this.state.level + 1 })
        this.levelAdvanceTicks = STARTING_LEVEL_ADVANCE_TICKS * this.state.level;
        this.interval = this.getShortenedInterval(this.interval);
      }
      this.props.onIntervalTick(this.state.counter);
      this.stopTimer();
      this.timers.push(setTimeout(internalCallback, this.interval));
    };
    this.stopTimer();
    this.timers.push(setTimeout(internalCallback, this.interval));
  }


  stopTimer = () => {
    for (let timeoutIndex in this.timers) {
      let timeoutId = this.timers[timeoutIndex];
      clearTimeout(timeoutId);
      this.timers.splice(timeoutIndex,1);
    }
  }

  render() {
    return (
      <span><h4>Level:{this.state.level}</h4></span>
    );
  }
}