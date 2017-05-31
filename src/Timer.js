import React, { Component } from 'react';

export class Timer extends Component {
  constructor() {
    super();
    this.counter = 0;
    this.intervalId = setInterval(() => {
      this.setState({counter: this.counter++});
      this.props.onTimeChange(this.counter);
    }, 500);
  }

  stopTimer() {
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <span>Time:{this.counter}</span>
    );
  }
}