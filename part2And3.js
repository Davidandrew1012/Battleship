const readlineSync = require("readline-sync");

class BattleshipGame {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.shipSizes = [2, 3, 3, 4, 5];
    this.board = this.buildGrid();
    this.remainingShips = this.shipSizes.length;
    this.guessedLocations = new Set();
    this.shipHits = new Array(this.shipSizes.length).fill(0);
    this.shipPlacements = []; // Store ship placements
    this.placeShipsRandomly(); // Initialize ship placement randomly
  }

  buildGrid() {
    return Array.from({ length: this.boardSize }, () =>
      Array(this.boardSize).fill(" ")
    );
  }

  getRandomNum = (max) => {
    return Math.floor(Math.random() * max);
  }
  
  placeShipsRandomly() {
    this.shipPlacements = [];
    this.shipSizes.forEach((size, shipIndex) => {
      let placed = false;
      while (!placed) {
        let direction = Math.random() < 0.5 ? "horizontal" : "vertical";
        let row, col;
        const arrParams = [this.boardSize, this.boardSize - size + 1];
        const params = direction === "horizontal" ? arrParams : arrParams.reverse();
        row = this.getRandomNum(params[0]);
        col = this.getRandomNum(params[1]);
        
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
          let shipPlacement = [];
          for (let i = 0; i < size; i++) {
            if (direction === "horizontal") {
              this.board[row][col + i] = shipIndex;
              shipPlacement.push([row, col + i]);
            } else {
              this.board[row + i][col] = shipIndex;
              shipPlacement.push([row + i, col]);
            }
          }
          this.shipPlacements.push(shipPlacement); // Store ship placement
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

  restart() {
    this.board = this.buildGrid();
    this.remainingShips = this.shipSizes.length;
    this.guessedLocations.clear();
    this.shipHits = new Array(this.shipSizes.length).fill(0);

    // Reset ship placement randomly
    this.placeShipsRandomly();
  }

  start() {
    console.log("Press any key!");
    readlineSync.keyInPause();
    let turnIterator = this.playTurn();
    while (this.remainingShips > 0) {
      turnIterator.next();
    }
    this.printBoard();
    let playAgain = readlineSync.keyInYNStrict("You win! Play again?");
    if (playAgain) {
      this.restart();
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
//     this.shipSizes = [2, 3, 3, 4, 5];
//     this.board = this.buildGrid();
//     this.remainingShips = this.shipSizes.length;
//     this.guessedLocations = new Set();
//     this.shipHits = new Array(this.shipSizes.length).fill(0);
//   }

//   buildGrid() {
//     return Array.from({ length: this.boardSize }, () =>
//       Array(this.boardSize).fill(" ")
//     );
//   }

//   placeShips() {
//     this.shipSizes.forEach((size, shipIndex) => {
//       let placed = false;
//       while (!placed) {
//         let direction = Math.random() < 0.5 ? "horizontal" : "vertical";
//         let row, col;
//         if (direction === "horizontal") {
//           row = Math.floor(Math.random() * this.boardSize);
//           col = Math.floor(Math.random() * (this.boardSize - size + 1));
//         } else {
//           row = Math.floor(Math.random() * (this.boardSize - size + 1));
//           col = Math.floor(Math.random() * this.boardSize);
//         }
//         let clearPath = true;
//         for (let i = 0; i < size; i++) {
//           if (
//             direction === "horizontal" &&
//             this.board[row][col + i] !== " "
//           ) {
//             clearPath = false;
//             break;
//           } else if (
//             direction === "vertical" &&
//             this.board[row + i][col] !== " "
//           ) {
//             clearPath = false;
//             break;
//           }
//         }
//         if (clearPath) {
//           for (let i = 0; i < size; i++) {
//             if (direction === "horizontal") {
//               this.board[row][col + i] = shipIndex;
//             } else {
//               this.board[row + i][col] = shipIndex;
//             }
//           }
//           placed = true;
//         }
//       }
//     });
//   }

//   isValidInput(input) {
//     if (input.length < 2 || input.length > 3) return false;
//     const colChar = input.charAt(0);
//     const rowStr = input.slice(1);
//     const row = colChar.charCodeAt(0) - 65;
//     const col = parseInt(rowStr, 10) - 1;
//     return (
//       row >= 0 &&
//       row < this.boardSize &&
//       !isNaN(col) &&
//       col >= 0 &&
//       col < this.boardSize
//     );
//   }

//   printBoard() {
//     const columnLabels = Array.from({ length: this.boardSize }, (_, i) => i + 1);
//     console.log("  " + columnLabels.join(" "));
//     console.log("-".repeat((this.boardSize * 2) + 1));
//     const rowLabels = Array.from({ length: this.boardSize }, (_, i) => String.fromCharCode(65 + i));
//     this.board.forEach((row, index) => {
//       console.log(`${rowLabels[index]}|${row.map(cell => cell === "X" || cell === "O" ? cell : " ").join("|")}|`);
//     });
//     console.log("-".repeat((this.boardSize * 2) + 1));
//   }

//   *playTurn() {
//     let userGuess;
//     const boardRange = `A1 to ${String.fromCharCode(
//       65 + this.boardSize - 1
//     )}${this.boardSize}`;
//     while (true) {
//       this.printBoard();
//       userGuess = readlineSync
//         .question(`Enter a location to strike! *e.g. ${boardRange}: `)
//         .toUpperCase();
//       if (!this.isValidInput(userGuess)) {
//         console.log("Invalid Input");
//         continue;
//       }
//       let row = userGuess.charCodeAt(0) - 65;
//       let col = parseInt(userGuess.slice(1), 10) - 1;

//       if (this.guessedLocations.has(userGuess)) {
//         console.log("You already tried this location!");
//       } else {
//         this.guessedLocations.add(userGuess);
//         const cellContent = this.board[row][col];
//         if (cellContent !== " ") {
//           console.log("Hit!");
//           this.board[row][col] = "X";
//           this.shipHits[cellContent]++;
//           if (this.shipHits[cellContent] === this.shipSizes[cellContent]) {
//             console.log("Ship sank!");
//             this.remainingShips--;
//           }
//         } else {
//           console.log("You missed that one... Try another!");
//           this.board[row][col] = "O";
//         }
//       }
//       yield;
//     }
//   }

//   start() {
//     console.log("Press any key!");
//     readlineSync.keyInPause();
//     this.placeShips();
//     let turnIterator = this.playTurn();
//     while (this.remainingShips > 0) {
//       turnIterator.next();
//     }
//     this.printBoard();
//     let playAgain = readlineSync.keyInYNStrict("You win! Play again?");
//     if (playAgain) {
//       this.board = this.buildGrid();
//       this.placeShips();
//       this.remainingShips = this.shipSizes.length;
//       this.guessedLocations.clear();
//       this.shipHits = new Array(this.shipSizes.length).fill(0);
//       this.start();
//     }
//   }
// }

// const game = new BattleshipGame(10); 
// game.start();

