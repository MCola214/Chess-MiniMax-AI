const assert = require("assert");
const Piece = require("./pieces/Piece");
const Bishop = require("./pieces/Bishop");
const King = require("./pieces/King");
const Knight = require("./pieces/Knight");
const Pawn = require("./pieces/Pawn");
const Queen = require("./pieces/Queen");
const Rook = require("./pieces/Rook");

const AlphaBeta = require("./minimax");

class Chess {
	// private attribute
	#playerTurn;
	#userColour;
	#gameObject;
	#winner;
	#actions;

	constructor(gameObject) {
		this.#gameObject = gameObject;
		this.#playerTurn = gameObject.playerTurn;
		this.#userColour = gameObject.userColour;
		this.#winner = gameObject.winner;
		this.board = this.#createBoard(gameObject);

		const actionList = ["standard", "castleKingside", "castleQueenside", "promotion", "invalid"];
		const actions = {};
		for (const a of actionList) {
			actions[a] = a;
		}
		this.#actions = Object.freeze(actions);
	}

	#createBoard(gameObject) {
		const board = []
		for (let i = 0; i < 8; i++) {
			let row = [];
			for (let j = 0; j < 8; j++) {
				const currentPiece = gameObject[i][j];
				const pieceToAdd = this.addPiece(i, j, currentPiece.colour, currentPiece.type, currentPiece.hasMoved);
				row.push(pieceToAdd);
			}
			board.push(row);
		}
		return board;
	}

	print() {
		console.log(this.board);
	}

	addPiece(row, col, colour, type, hasMoved) {
		switch (type) {
			case "bishop":
				return new Bishop(row, col, colour, hasMoved);
			case "king":
				return new King(row, col, colour, hasMoved);
			case "knight":
				return new Knight(row, col, colour, hasMoved);
			case "pawn":
				return new Pawn(row, col, colour, hasMoved);
			case "queen":
				return new Queen(row, col, colour, hasMoved);
			case "rook":
				return new Rook(row, col, colour, hasMoved);
			default:
				return {}
		}
	}

	#togglePlayerMove() {
		if (this.#playerTurn === "white") {
			this.#playerTurn = "black";
		} else {
			this.#playerTurn = "white";
		}
	}

	#checkValidMove(pieceRow, pieceCol, moveToRow, moveToCol) {
		// make sure space is on board
		const validSpace = this.checkValidSpace(pieceRow) && this.checkValidSpace(pieceCol);
		if (!validSpace || this.#winner !== "empty") {
			return this.#actions.invalid;
		}
		// make sure piece that's moving belongs to current player
		if (this.getPiece(pieceRow, pieceCol).colour === this.#playerTurn) {
			// check if piece destination is valid
			const moveList = this.board[pieceRow][pieceCol].getMoveList(this);
			for (let i = 0; i < moveList.length; i++) {
				if (moveList[i][0] === moveToRow && moveList[i][1] === moveToCol) {
					switch (moveList[i][2]) {
						case 0:
							return this.#actions.standard;
						case 1:
							return this.#actions.castleKingside;
						case 2:
							return this.#actions.castleQueenside;
						case 3:
							return this.#actions.promotion;
						default:
							return this.#actions.invalid;
					}

				}
			}
		}

		return this.#actions.invalid;
	}

	movePiece(pieceRow, pieceCol, moveToRow, moveToCol) {
		const action = this.#checkValidMove(pieceRow, pieceCol, moveToRow, moveToCol);
		const pieceColour = this.#playerTurn;
		let validMove = false;

		switch (action) {
			case "standard":
				this.#togglePlayerMove();
				this.#gameObject[moveToRow][moveToCol] = this.#gameObject[pieceRow][pieceCol];
				this.#gameObject[moveToRow][moveToCol].hasMoved = true;
				this.#gameObject[pieceRow][pieceCol] = { colour: "empty", type: "empty", hasMoved: false };
				this.#gameObject["playerTurn"] = this.#playerTurn;

				this.board = this.#createBoard(this.#gameObject);
				validMove = true;
				break;
			case "castleKingside":
				this.#togglePlayerMove();
				this.#gameObject[moveToRow][moveToCol] = this.#gameObject[pieceRow][pieceCol];
				this.#gameObject[moveToRow][moveToCol].hasMoved = true;
				this.#gameObject[pieceRow][pieceCol] = { colour: "empty", type: "empty", hasMoved: false };

				this.#gameObject[pieceRow][5] = { colour: pieceColour, type: "rook", hasMoved: true };
				this.#gameObject[pieceRow][7] = { colour: "empty", type: "empty", hasMoved: false };
				this.#gameObject["playerTurn"] = this.#playerTurn;

				this.board = this.#createBoard(this.#gameObject);
				validMove = true;
				break;
			case "castleQueenside":
				this.#togglePlayerMove();
				this.#gameObject[moveToRow][moveToCol] = this.#gameObject[pieceRow][pieceCol];
				this.#gameObject[moveToRow][moveToCol].hasMoved = true;
				this.#gameObject[pieceRow][pieceCol] = { colour: "empty", type: "empty", hasMoved: false };

				this.#gameObject[pieceRow][3] = { colour: pieceColour, type: "rook", hasMoved: true };
				this.#gameObject[pieceRow][0] = { colour: "empty", type: "empty", hasMoved: false };
				this.#gameObject["playerTurn"] = this.#playerTurn;

				this.board = this.#createBoard(this.#gameObject);
				validMove = true;
				break;
			case "promotion":
				this.#togglePlayerMove();
				this.#gameObject[moveToRow][moveToCol] = this.#gameObject[pieceRow][pieceCol];
				this.#gameObject[moveToRow][moveToCol].hasMoved = true;

				// For simplicity, assume promotion is always to queen
				this.#gameObject[moveToRow][moveToCol].type = "queen";
				this.#gameObject[pieceRow][pieceCol] = { colour: "empty", type: "empty", hasMoved: false };
				this.#gameObject["playerTurn"] = this.#playerTurn;

				this.board = this.#createBoard(this.#gameObject);
				validMove = true;
				break;
			case "invalid":
				break;
			default:
				break;
		}

		let AIColour = "black";
		if (this.#userColour === "black") {
			AIColour = "white";
		}

		const playerWins = this.isPlayerWin();
		const AIWins = this.isAIWin();

		let winner = "empty";
		if (playerWins || AIWins) {
			winner = playerWins ? this.#userColour : AIColour;
			this.#gameObject.winner = winner;
		}

		return { validMove: validMove, updatedGameObject: this.#gameObject, winner: winner };
	}

	getLegalMoves(moveColour) {
		const moveList = [];
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				const currentPiece = this.getPiece(i, j);

				// make sure piece belong's to input player
				if (currentPiece.colour === moveColour) {
					const currentPieceMoveList = this.board[i][j].getMoveList(this);
					for (let k = 0; k < currentPieceMoveList.length; k++) {
						moveList.push({
							moveToRow: currentPieceMoveList[k][0],
							moveToCol: currentPieceMoveList[k][1],
							selectedRow: i,
							selectedCol: j
						})
					}
				}
			}
		}

		return moveList;
	}

	getAIMove() {
		let AIColour = "black";
		if (this.#userColour === "black") {
			AIColour = "white";
		}

		// call get AI's move using AlphaBeta pruning and looking 4 moves ahead (2 moves each)
		const AIMove = AlphaBeta(this, AIColour, 2, -999999, 999999);

		const AIBestMove = AIMove.bestMove;
		return this.movePiece(AIBestMove.selectedRow, AIBestMove.selectedCol, AIBestMove.moveToRow, AIBestMove.moveToCol);
	}

	// to simplify game, player needs to actually capture oponent's king
	isPlayerWin() {
		let AIColour = "black";
		if (this.#userColour === "black") {
			AIColour = "white";
		}

		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				const currentPiece = this.getPiece(i, j);
				if (currentPiece.colour === AIColour && currentPiece.type === "king") {
					// return false if found AI's king
					return false;
				}
			}
		}
		return true;
	}

	// to simplify game, AI needs to actually capture players's king
	isAIWin() {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				const currentPiece = this.getPiece(i, j);
				if (currentPiece.colour === this.#userColour && currentPiece.type === "king") {
					// return false if found player's king
					return false;
				}
			}
		}
		return true;
	}

	getScore() {
		let AIColour = "black";
		if (this.#userColour === "black") {
			AIColour = "white";
		}

		let score = 0;
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				const currentPiece = this.getPiece(i, j);
				if (currentPiece.colour === this.#userColour) {
					score += currentPiece.value;
				} else if (currentPiece.colour === AIColour) {
					score -= currentPiece.value;
				}
			}
		}
		return score;
	}

	checkValidSpace(space) {
		const validSpaces = [0, 1, 2, 3, 4, 5, 6, 7];
		return validSpaces[space] === space;
	}

	copy() {
		const copy = JSON.parse(JSON.stringify(this.#gameObject));
		return new Chess(copy);
	}

	getPiece(row, col) {
		// for testing purposes, would need to remove in a production build
		// getPiece assumes valid arguments
		assert.ok(this.checkValidSpace(row), `Invalid row given to board: ${row}`);
		assert.ok(this.checkValidSpace(col), `Invalid row given to board: ${col}`);

		if (this.spaceEmpty(row, col)) {
			return {};
		}
		return this.board[row][col].copy();
	}

	spaceEmpty(row, col) {
		// for testing purposes, would need to remove in a production build
		// spaceEmpty assumes valid arguments
		assert.ok(this.checkValidSpace(row), `Invalid row given to board: ${row}`);
		assert.ok(this.checkValidSpace(col), `Invalid row given to board: ${col}`);

		return Object.keys(this.board[row][col]).length === 0;
	}
}

module.exports = Chess;
