const readlineSync = require("readline-sync");

class BattleshipGame {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.shipSizes = [2, 3, 3, 4, 5];
    this.board = this.buildGrid();
    this.remainingShips = this.shipSizes.length;
    this.guessedLocations = new Set();
    this.shipHits = new Array(this.shipSizes.length).fill(0);
  }

  buildGrid() {
    return Array.from({ length: this.boardSize }, () =>
      Array(this.boardSize).fill(" ")
    );
  }

  placeShips() {
    this.shipSizes.forEach((size, shipIndex) => {
      let placed = false;
      while (!placed) {
        let direction = Math.random() < 0.5 ? "horizontal" : "vertical";
        let row, col;
        if (direction === "horizontal") {
          row = Math.floor(Math.random() * this.boardSize);
          col = Math.floor(Math.random() * (this.boardSize - size + 1));
        } else {
          row = Math.floor(Math.random() * (this.boardSize - size + 1));
          col = Math.floor(Math.random() * this.boardSize);
        }
        let clearPath = true;
        for (let i = 0; i < size; i++) {
          if (
            direction === "horizontal" &&
            this.board[row][col + i] !== " "
          ) {
            clearPath = false;
            break;
          } else if (
            direction === "vertical" &&
            this.board[row + i][col] !== " "
          ) {
            clearPath = false;
            break;
          }
        }
        if (clearPath) {
          for (let i = 0; i < size; i++) {
            if (direction === "horizontal") {
              this.board[row][col + i] = shipIndex;
            } else {
              this.board[row + i][col] = shipIndex;
            }
          }
          placed = true;
        }
      }
    });
  }

  isValidInput(input) {
    if (input.length < 2 || input.length > 3) return false;
    const colChar = input.charAt(0);
    const rowStr = input.slice(1);
    const row = colChar.charCodeAt(0) - 65;
    const col = parseInt(rowStr, 10) - 1;
    return (
      row >= 0 &&
      row < this.boardSize &&
      !isNaN(col) &&
      col >= 0 &&
      col < this.boardSize
    );
  }

  printBoard() {
    const columnLabels = Array.from({ length: this.boardSize }, (_, i) => i + 1);
    console.log("  " + columnLabels.join(" "));
    console.log("-".repeat((this.boardSize * 2) + 1));
    const rowLabels = Array.from({ length: this.boardSize }, (_, i) => String.fromCharCode(65 + i));
    this.board.forEach((row, index) => {
      console.log(`${rowLabels[index]}|${row.map(cell => cell === "X" || cell === "O" ? cell : " ").join("|")}|`);
    });
    console.log("-".repeat((this.boardSize * 2) + 1));
  }

  *playTurn() {
    let userGuess;
    const boardRange = `A1 to ${String.fromCharCode(
      65 + this.boardSize - 1
    )}${this.boardSize}`;
    while (true) {
      this.printBoard();
      userGuess = readlineSync
        .question(`Enter a location to strike! *e.g. ${boardRange}: `)
        .toUpperCase();
      if (!this.isValidInput(userGuess)) {
        console.log("Invalid Input");
        continue;
      }
      let row = userGuess.charCodeAt(0) - 65;
      let col = parseInt(userGuess.slice(1), 10) - 1;

      if (this.guessedLocations.has(userGuess)) {
        console.log("You already tried this location!");
      } else {
        this.guessedLocations.add(userGuess);
        const cellContent = this.board[row][col];
        if (cellContent !== " ") {
          console.log("Hit!");
          this.board[row][col] = "X";
          this.shipHits[cellContent]++;
          if (this.shipHits[cellContent] === this.shipSizes[cellContent]) {
            console.log("Ship sank!");
            this.remainingShips--;
          }
        } else {
          console.log("You missed that one... Try another!");
          this.board[row][col] = "O";
        }
      }
      yield;
    }
  }

  start() {
    console.log("Press any key!");
    readlineSync.keyInPause();
    this.placeShips();
    let turnIterator = this.playTurn();
    while (this.remainingShips > 0) {
      turnIterator.next();
    }
    this.printBoard();
    let playAgain = readlineSync.keyInYNStrict("You win! Play again?");
    if (playAgain) {
      this.board = this.buildGrid();
      this.placeShips();
      this.remainingShips = this.shipSizes.length;
      this.guessedLocations.clear();
      this.shipHits = new Array(this.shipSizes.length).fill(0);
      this.start();
    }
  }
}

const game = new BattleshipGame(10); 
game.start();




// const readlineSync = require("readline-sync");

// class BattleshipGame {
//   constructor(boardSize) {
//     this.boardSize = boardSize;
//     this.shipSizes = [2, 3, 3, 4, 5]; // Ship sizes according to requirements
//     this.board = this.initializeBoard();
//     this.remainingShips = this.shipSizes.length;
//     this.guessedLocations = new Set();
//   }

//   initializeBoard() {
//     return Array.from({ length: this.boardSize }, () =>
//       Array(this.boardSize).fill(false)
//     );
//   }

//   placeShip(size) {
//     let placed = false;
//     while (!placed) {
//       let direction = Math.random() < 0.5 ? "horizontal" : "vertical";
//       let row, col;
//       if (direction === "horizontal") {
//         row = Math.floor(Math.random() * this.boardSize);
//         col = Math.floor(Math.random() * (this.boardSize - size + 1));
//       } else {
//         row = Math.floor(Math.random() * (this.boardSize - size + 1));
//         col = Math.floor(Math.random() * this.boardSize);
//       }

//       // Check if the path is clear
//       let clearPath = true;
//       for (let i = 0; i < size; i++) {
//         if (
//           direction === "horizontal" &&
//           this.board[row][col + i] === true
//         ) {
//           clearPath = false;
//           break;
//         } else if (
//           direction === "vertical" &&
//           this.board[row + i][col] === true
//         ) {
//           clearPath = false;
//           break;
//         }
//       }

//       if (clearPath) {
//         // Place the ship
//         for (let i = 0; i < size; i++) {
//           if (direction === "horizontal") {
//             this.board[row][col + i] = true;
//           } else {
//             this.board[row + i][col] = true;
//           }
//         }
//         placed = true;
//       }
//     }
//   }

//   isValidInput(input) {
//     if (input.length < 2 || input.length > 3) return false;
//     const colChar = input.charAt(0);
//     const rowStr = input.slice(1);
//     const col = colChar.charCodeAt(0) - 65;
//     const row = parseInt(rowStr, 10) - 1;
//     return (
//       col >= 0 &&
//       col < this.boardSize &&
//       !isNaN(row) &&
//       row >= 0 &&
//       row < this.boardSize
//     );
//   }

//   *playTurn() {
//     let userGuess;
//     const boardRange = `A1 to ${String.fromCharCode(65 + this.boardSize - 1)}${
//       this.boardSize
//     }`;
//     while (true) {
//       userGuess = readlineSync
//         .question(`Enter a location to strike! *e.g. ${boardRange}: `)
//         .toUpperCase();
//       if (!this.isValidInput(userGuess)) {
//         console.log("Invalid Input");
//         continue;
//       }
//       let col = userGuess.charCodeAt(0) - 65;
//       let row = parseInt(userGuess.slice(1), 10) - 1;

//       if (this.guessedLocations.has(userGuess)) {
//         console.log("You already tried this location!");
//       } else {
//         this.guessedLocations.add(userGuess);
//         if (this.board[row][col]) {
//           console.log("Hit!");
//           this.remainingShips--;
//         } else {
//           console.log("You missed that one... Try another!");
//         }
//       }
//       yield;
//     }
//   }

//   start() {
//     console.log("Press any key!");
//     readlineSync.keyInPause();
//     this.shipSizes.forEach((size) => this.placeShip(size));
//     const turnIterator = this.playTurn();
//     while (this.remainingShips > 0) {
//       turnIterator.next();
//       if (this.remainingShips === 0) {
//         let playAgain = readlineSync.keyInYNStrict("You win! Play again?");
//         if (playAgain) {
//           this.board = this.initializeBoard();
//           this.shipSizes.forEach((size) => this.placeShip(size));
//           this.remainingShips = this.shipSizes.length;
//           this.guessedLocations.clear();
//         } else {
//           break;
//         }
//       }
//     }
//   }
// }

// const game = new BattleshipGame(10); // Adjust board size as needed
// game.start();
