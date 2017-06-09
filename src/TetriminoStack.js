import React, { Component } from 'react';
import { TetriminoI, TetriminoJ, TetriminoL, TetriminoO, TetriminoS, TetriminoT, TetriminoZ } from './Tetriminos.js';

let STACK_CAPACITY = 4;
let STACK_HEIGHT = 6 * STACK_CAPACITY;
let STACK_WIDTH = 6;

export class TetriminoStack extends Component {
    constructor() {
        super();
        this.stack = this.getTetriminosStack();
        this.state = {
            stackBoard: this.getStackBoard()
        };
    }

    getTetriminosStack() {
        let stack = [];
        while (stack.length < STACK_CAPACITY) {
            stack.push(this.getRandomTetrimino());
        }
        return stack;
    }

    pop () {
        var tetrimino = this.stack[0];
        this.stack.splice(0,1);
        this.stack.push(this.getRandomTetrimino());
        this.setState({stackBoard: this.getStackBoard()});
        return tetrimino;
    }

    getRandomTetrimino() {
        let random = Math.floor((Math.random() * 7) + 1);
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

    getStackBoard() {
        let stackBoard = this.getBlankStackBoard();
        let i = 0, stackIndex = 0;
        for (i=0, stackIndex = 0; i<stackBoard.length; i+=6, stackIndex++) {
            let tCoords = this.stack[stackIndex].dotArray;
            for (let rowIndex=0; rowIndex<tCoords.length; rowIndex++) {
                for (let cellIndex=0; cellIndex<tCoords[rowIndex].length; cellIndex++) {
                    if (!!tCoords[rowIndex][cellIndex]) {
                        stackBoard[stackIndex * 6 + rowIndex][cellIndex] = tCoords[rowIndex][cellIndex];
                    }
                }
            }
        }

        return stackBoard.concat();
    }

    getBlankStackBoard() {
        let stackBoard = [];
        for (let i=0; i<STACK_HEIGHT; i++) {
            stackBoard.push([]);
            for (let j=0; j<STACK_WIDTH; j++) {
                stackBoard[i].push(false);
            }
        }
        return stackBoard;
    }

    render() {
        return (
            <div className="tetrimino-stack-outer">
                <h4 className="tetrimino-stack-header">Next:</h4>
                <div className="tetrimino-stack">
                    <table>
                        <tbody>
                            {
                                this.state.stackBoard.map(function(row, i) {
                                    return (
                                        <tr key={i}>
                                            {
                                                row.map(function(col, j){
                                                    return (<td className="stack-cell" key={j}><div className={col === 1? 'red': col === 2? 'gray': col === 3? 'purple' : col === 4 ? 'blue' : col === 5 ? 'green' : col === 6 ? 'brown' : col === 7 ? 'teal' : ''}>{col}</div></td>);
                                                })
                                            }
                                        </tr>
                                    );
                                })
                            }
                        </tbody> 
                    </table>
                </div>
            </div>
        );
    }
}
