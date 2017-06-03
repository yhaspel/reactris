class Tetrimino{
  constructor(color, dotArray, tetriminoClass) {
    this.color = color;
    this.tetriminoClass = tetriminoClass;
    this.dotArray = dotArray;
    this.position = 0;
    this.coordinates = {
      i: 0,
      j: 0
    }
  }

  cloneTetriminoProperties(tetriminoInstance) {
    this.color = tetriminoInstance.color;
    this.dotArray = JSON.parse(JSON.stringify(tetriminoInstance.dotArray));
    this.position = tetriminoInstance.position;
    this.coordinates = {
      i: tetriminoInstance.coordinates.i,
      j: tetriminoInstance.coordinates.j
    }
  }

  setCoordinates = (coords) => {
    if (!coords) {
      throw new Error("no coordinate parameter!");
    }
    if (!coords.i) {
      coords.i = this.coordinates.i;
    }
    if (!coords.j) {
      coords.j = this.coordinates.j;
    }

    this.coordinates = coords;
  }
  
  advanceYCoords = () => {
    this.coordinates.i++;
  }

  getRightmostIndex= () => {
    let rightmost = 0;
    for (let i=0; i<this.dotArray.length; i++) {
      for (let j=0; j<this.dotArray[i].length; j++) {
        if (this.dotArray[i][j] && rightmost < j) {
          rightmost = j;
        }
      }
    }
    return rightmost+1;
  }

  getBottomIndex= () => {
    let bottom = 0;
    for (let i=0; i<this.dotArray.length; i++) {
      for (let j=0; j<this.dotArray[i].length; j++) {
        if (this.dotArray[i][j] && bottom < i) {
          bottom = i;
        }
      }
    }
    return bottom;
  }
  
  setNewRotationPosition() {
    switch (this.position) {
      case 0: 
        this.position = 90;
        break;
      case 90: 
        this.position = 180;       
        break;
      case 180: 
        this.position = 270;
        break;
      case 270: 
        this.position = 0;
        break;
      default: throw new Error('Error rotating Tetriminos!');
    }
  }

}

export class TetriminoI extends Tetrimino {
  constructor(){
    super('red', [
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ], 'TetriminoI');
  }

  rotate() {
    super.setNewRotationPosition();
    if (this.position === 0 || this.position === 180) {
      this.dotArray = [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
    }
    if (this.position === 90 || this.position === 270) {
      this.dotArray = [
          [1],
          [1],
          [1],
          [1],
          [0]
        ];
    }
  }
}

export class TetriminoJ extends Tetrimino {
  constructor(){
    super('gray', [
      [2, 2, 2],
      [0, 0, 2],
      [0, 0, 0]
    ], 'TetriminoJ');
  }

  rotate() {
    super.setNewRotationPosition();
    if (this.position === 0) {
      this.dotArray = [
        [2, 2, 2],
        [0, 0, 2],
        [0, 0, 0]
      ];
    }
    if (this.position === 90) {
      this.dotArray = [
        [0, 2, 0],
        [0, 2, 0],
        [2, 2, 0],
        [0, 0, 0]
      ];
    }
    if (this.position === 180) {
      this.dotArray = [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
      ];
    }
    if (this.position === 270) {
      this.dotArray = [
        [2, 2, 0],
        [2, 0, 0],
        [2, 0, 0],
        [0, 0, 0]
      ];
    }
  }
}

export class TetriminoL extends Tetrimino {
  constructor(){
    super('purple', [
      [3, 3, 3],
      [3, 0, 0],
      [0, 0, 0]
    ], 'TetriminoL');
  }

  rotate() {
    super.setNewRotationPosition();
    if (this.position === 0) {
      this.dotArray = [
        [3, 3, 3],
        [3, 0, 0],
        [0, 0, 0]
      ];
    }
    if (this.position === 90) {
      this.dotArray = [
        [3, 3, 0],
        [0, 3, 0],
        [0, 3, 0],
        [0, 0, 0]
      ];
    }
    if (this.position === 180) {
      this.dotArray = [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
      ];
    }
    if (this.position === 270) {
      this.dotArray = [
        [3, 0, 0],
        [3, 0, 0],
        [3, 3, 0],
        [0, 0, 0]
      ];
    }
  }
}

export class TetriminoO extends Tetrimino {
  constructor(){
    super('blue', [
      [4, 4, 0],
      [4, 4, 0],
      [0, 0, 0]
    ], 'TetriminoO');
  }

  rotate() {
    super.setNewRotationPosition();
  }
}

export class TetriminoS extends Tetrimino {
  constructor(){
    super('green', [
      [0, 5, 5],
      [5, 5, 0],
      [0, 0, 0]
    ], 'TetriminoS');
  }

  rotate() {
    super.setNewRotationPosition();
    if (this.position === 0 || this.position === 180) {
      this.dotArray = [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
      ];
    }
    if (this.position === 90 || this.position === 270) {
      this.dotArray = [
        [5, 0, 0],
        [5, 5, 0],
        [0, 5, 0],
        [0, 0, 0]
      ];
    }
  }
}

export class TetriminoT extends Tetrimino {
  constructor(){
    super('brown', [
      [6, 6, 6],
      [0, 6, 0],
      [0, 0, 0]
    ], 'TetriminoT');
  }

  rotate() {
    super.setNewRotationPosition();
    if (this.position === 0) {
      this.dotArray = [
        [6, 6, 6],
        [0, 6, 0],
        [0, 0, 0]
      ];
    }
    if (this.position === 90) {
      this.dotArray = [
        [0, 6, 0],
        [6, 6, 0],
        [0, 6, 0],
        [0, 0, 0]
      ];
    }
    if (this.position === 180) {
      this.dotArray = [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]
      ];
    }
    if (this.position === 270) {
      this.dotArray = [
        [6, 0, 0],
        [6, 6, 0],
        [6, 0, 0],
        [0, 0, 0]
      ];
    }
  }
}

export class TetriminoZ extends Tetrimino {
  constructor(){
    super('teal', [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0]
    ], 'TetriminoZ');
  }

  rotate() {
    super.setNewRotationPosition();
    if (this.position === 0 || this.position === 180) {
      this.dotArray = [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
      ];
    }
    if (this.position === 90 || this.position === 270) {
      this.dotArray = [
        [0, 7, 0],
        [7, 7, 0],
        [7, 0, 0],
        [0, 0, 0]
      ];
    }
  }
}