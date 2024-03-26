const readlineSync = require("readline-sync");

class BattleshipGame {
  constructor(boardSize, shipCount) {
    this.boardSize = boardSize;
    this.shipCount = shipCount;
    this.board = this.initializeBoard();
    this.remainingShips = shipCount;
    this.guessedLocations = new Set();
  }

  initializeBoard() {
    return Array.from({ length: this.boardSize }, () =>
      Array(this.boardSize).fill(false)
    );
  }

  placeShips() {
    let ships = 0;
    while (ships < this.shipCount) {
      let [row, col] = [1, 2].map((item) => Math.floor(Math.random() * this.boardSize))
      // let row = Math.floor(Math.random() * this.boardSize); // line above counts for both lines here
      // let col = Math.floor(Math.random() * this.boardSize);
      if (!this.board[row][col]) {
        this.board[row][col] = true;
        ships++;
      }
    }
  }

  isValidInput(input) {
    const isInputLengthTwo = input.length === 2
    const doesLetterFitBoard = 
      input.charCodeAt(0) - 65 < this.boardSize &&
      input.charCodeAt(0) - 65 >= 0
    const doesNumberFitBoard = input[1] <= this.boardSize && input[1] > 0;
    return (
      isInputLengthTwo && doesLetterFitBoard && doesNumberFitBoard
    );
  }

  hitsAndMisses = (userGuess, row, col) => {
    if (this.guessedLocations.has(userGuess)) {
      console.log("You already tried this location!");
    } else {
      this.guessedLocations.add(userGuess);
      if (this.board[row][col]) {
        console.log("Hit!");
        this.remainingShips--;
      } else {
        console.log("You missed that one... Try another!");
      }
    }
  }

  *playTurn() {
    let userGuess;
    const boardRange = `A1 to ${String.fromCharCode(65 + this.boardSize - 1)}${this.boardSize}`
    while (true) {
      userGuess = readlineSync
        .question(`Enter a location to strike! *e.g. ${boardRange}: `)
        .toUpperCase();
      if (!this.isValidInput(userGuess)) {
        console.log("Invalid Input");
        continue;
      }
      let col = userGuess.charCodeAt(0) - 65;
      let row = parseInt(userGuess.charAt(1)) - 1;
      this.hitsAndMisses(userGuess, row, col)
      
      yield;
    }
  }

  start() {
    console.log("Press any key!");
    readlineSync.keyInPause();
    this.placeShips();
    const turnIterator = this.playTurn();
    while (this.remainingShips > 0) {
      turnIterator.next();
      if (this.remainingShips === 0) {
        let playAgain = readlineSync.keyInYNStrict("You win! Play again?");
        if (playAgain) {
          this.board = this.initializeBoard();
          this.placeShips();
          this.remainingShips = this.shipCount;
          this.guessedLocations.clear();
        } else {
          break;
        }
      }
    }
  }
}

const game = new BattleshipGame(3, 2);
game.start();
