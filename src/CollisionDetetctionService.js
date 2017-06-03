import { TetriminoI, TetriminoJ, TetriminoL, TetriminoO, TetriminoS, TetriminoT, TetriminoZ } from './Tetriminos.js';

import {BOARD_HEIGHT, BOARD_WIDTH} from './constants.js';

export function detectCollision(type, board, currentTetrimino) {
    switch (type) {
        case 'bottom':
            return detectBottomCollision(board, currentTetrimino);
        case 'left':
            return detectLeftCollision(board, currentTetrimino);
        case 'right': 
            return detectRightCollision(board, currentTetrimino);
        case 'rotate':
            return detectRotationCollisionAndAdjustCoords(board, currentTetrimino);
        default:
            throw new Error('Error in detecton type!');
    }
}


function getNextTetrimino(currentTetrimino) {
    let nextTetrimino;
    switch (currentTetrimino.tetriminoClass) {
      case 'TetriminoI':
        nextTetrimino = new TetriminoI();
        break;
      case 'TetriminoJ':
        nextTetrimino = new TetriminoJ();
        break;
      case 'TetriminoL':
        nextTetrimino = new TetriminoL();
        break;
      case 'TetriminoO':
        nextTetrimino = new TetriminoO();
        break;
      case 'TetriminoS':
        nextTetrimino = new TetriminoS();
        break;
      case 'TetriminoT':
        nextTetrimino = new TetriminoT();
        break;
      case 'TetriminoZ':
        nextTetrimino = new TetriminoZ();
        break;
      default:
        throw new Error('Error generating tetrimino!');
    }
    nextTetrimino.cloneTetriminoProperties(currentTetrimino);
    nextTetrimino.rotate();
    return nextTetrimino;
  }

  function detectRotationCollisionAndAdjustCoords(boardArray, currentTetrimino) {
    let nextTetrimino = getNextTetrimino(currentTetrimino);
    let borderAdjustCoord = getOutOfBorderCoord(nextTetrimino);
    let collisionCoordsAffected = false;

    if (!!borderAdjustCoord) {
      if (borderAdjustCoord.i >= BOARD_HEIGHT) {
        collisionCoordsAffected = true;
        nextTetrimino.coordinates.i = nextTetrimino.coordinates.i - (borderAdjustCoord.i - BOARD_HEIGHT + 1);
      }

      if (borderAdjustCoord.j >= BOARD_WIDTH) {
        collisionCoordsAffected = true;
        nextTetrimino.coordinates.j = nextTetrimino.coordinates.j - (borderAdjustCoord.j - BOARD_WIDTH + 1);
      }
    }

    let collisionAdjustCoord = getCollisionCoord(nextTetrimino, boardArray);
    while (!!collisionAdjustCoord) {
      collisionCoordsAffected = true;
      if (nextTetrimino.coordinates.i > 0) {
        nextTetrimino.coordinates.i -= 1;
      }

      collisionAdjustCoord = getCollisionCoord(nextTetrimino, boardArray);
    };

    if (collisionCoordsAffected) {
      currentTetrimino.coordinates.i = nextTetrimino.coordinates.i;
      currentTetrimino.coordinates.j = nextTetrimino.coordinates.j;
    }
  }

  function getCollisionCoord(nextTetrimino, boardArray) {
    let coords = [];
    for(let i=0; i<nextTetrimino.dotArray.length; i++) {
      for(let j=0; j<nextTetrimino.dotArray[0].length; j++) {
        if (!!nextTetrimino.dotArray[i][j]) {
          if (!!boardArray[nextTetrimino.coordinates.i + i][nextTetrimino.coordinates.j + j]) {
            coords.push({
              i: (nextTetrimino.coordinates.i + i),
              j: (nextTetrimino.coordinates.j + j)
            })
          }
        }
      }
    }

    return coords.length? coords : false;
  }

  function getOutOfBorderCoord(nextTetrimino) {
    let coords = [];
    for(let i=0; i<nextTetrimino.dotArray.length; i++) {
      for(let j=0; j<nextTetrimino.dotArray[0].length; j++) {
        if (!!nextTetrimino.dotArray[i][j] 
        && (nextTetrimino.coordinates.i + i >= BOARD_HEIGHT
        || nextTetrimino.coordinates.j + j >= BOARD_WIDTH
        || nextTetrimino.coordinates.i + i < 0)) {
          coords.push({
            i: (nextTetrimino.coordinates.i + i),
            j: (nextTetrimino.coordinates.j + j)
          })
        }
      }
    }
    let divergentCoord = {i: 0, j: 0};
    for (let coord of coords) {
      if (coord.i > divergentCoord.i
      || coord.j > divergentCoord.j) {
        divergentCoord.i = coord.i;
        divergentCoord.j = coord.j;
      }
    }
    return coords.length? divergentCoord : false;
  }

  function detectRightCollision(boardArray, currentTetrimino) {
      let coords = getRightCoords(currentTetrimino);
      for (let coord of coords) { 
        let i = coord.i;
        let j = coord.j;
        if (j+1 >= BOARD_WIDTH
        || !!boardArray[i][j+1]) {
          return true;
        }
      }
      return false;
  }

  function getRightCoords(currentTetrimino) {
    let coords = [];
    for(let i=0; i<currentTetrimino.dotArray.length; i++) {
      for(let j=currentTetrimino.dotArray[0].length-1; j>=0; j--) {
        if (!!currentTetrimino.dotArray[i][j]) { 
          coords.push(
            {
              i: (i + currentTetrimino.coordinates.i), 
              j: (j + currentTetrimino.coordinates.j)              
            }
          );
          continue;
        }
      }
    }
    return coords;
  }

  function detectLeftCollision(boardArray, currentTetrimino) {
      let coords = getLeftCoords(currentTetrimino);

      for (let coord of coords) { 
        let i = coord.i;
        let j = coord.j;
        if (j <= 0
        || !!boardArray[i][j-1]) {
          return true;
        }
      }
      return false;
  }

  function getLeftCoords(currentTetrimino) {
    let coords = [];
    for(let i=0; i<currentTetrimino.dotArray.length; i++) {
      for(let j=0; j<currentTetrimino.dotArray[0].length; j++) {
        if (!!currentTetrimino.dotArray[i][j]) {
          coords.push(
            {
              i: (i + currentTetrimino.coordinates.i), 
              j: (j + currentTetrimino.coordinates.j)              
            }
          );
          continue;
        }
      }
    }
    return coords;
  }

  function detectBottomCollision(boardArray, currentTetrimino) {
      let coords = getBottomCoords(currentTetrimino);

      for (let coord of coords) { 
        let i = coord.i;
        let j = coord.j;
        if (i+1 >= boardArray.length
        || !!boardArray[i+1][j]) {
          return true;
        }
      }
      return false;
  }

  function getBottomCoords(currentTetrimino) {
    let coords = [];

    for(let j=0; j< currentTetrimino.dotArray[0].length; j++) {
      for(let i=0; i< currentTetrimino.dotArray.length; i++) {
        if (!!currentTetrimino.dotArray[i][j] 
        && !!!currentTetrimino.dotArray[i+1][j]) {
          coords.push(
            {
              i: (i + currentTetrimino.coordinates.i), 
              j: (j + currentTetrimino.coordinates.j)              
            }
          );
        }
      }
    }
    return coords;
  }