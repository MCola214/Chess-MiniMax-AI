// import chessPiece from "../objects/chessPieces";
import King from "../objects/king";
import Queen from "../objects/queen"
import Rook from "../objects/rook"
import Bishop from "../objects/bishop"
import Knight from "../objects/knight"
import Pawn from "../objects/pawn"

export const updateBoard = (board, newBoardGrid) => {
	const gridArray = Array.from({ length: 8 }, () =>
		Array.from({ length: 8 }, () => {
			return {}
		})
	);

	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			switch (newBoardGrid[i][j].type) {
				case "king":
					gridArray[i][j] = new King(i, j, newBoardGrid[i][j].colour);
					break;
				case "queen":
					gridArray[i][j] = new Queen(i, j, newBoardGrid[i][j].colour);
					break;
				case "rook":
					gridArray[i][j] = new Rook(i, j, newBoardGrid[i][j].colour);
					break;
				case "knight":
					gridArray[i][j] = new Knight(i, j, newBoardGrid[i][j].colour);
					break;
				case "bishop":
					gridArray[i][j] = new Bishop(i, j, newBoardGrid[i][j].colour);
					break;
				case "pawn":
					gridArray[i][j] = new Pawn(i, j, newBoardGrid[i][j].colour);
					break;
				default:
					gridArray[i][j] = {};
					break;
			}
		}
	}

	board.setState({
		grid: gridArray
	})
}

// initialize the chessboard
export const initializeBoard = async (board) => {
	// post request to initialize the board
	const request = new Request("/chessAction/gameInit", {
		method: "post",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json"
		}
	})

	let json = null;
	try {
		const res = await fetch(request);
		if (res.status === 200) {
			json = await res.json();

			updateBoard(board, json);
		} else {
			console.log(`Status code: ${res.status}`);
		}

	} catch (error) {
		// simple error handling for now
		console.log(error);
	}
}

// move piece
export const movePiece = async (board, tile) => {
	const moveToRow = tile.state.row;
	const moveToCol = tile.state.col;
	const newSelectedRow = -1;
	const newSelectedCol = -1;

	const toMove = {
		selectedRow: board.state.selectedRow,
		selectedCol: board.state.selectedCol,
		moveToRow: moveToRow,
		moveToCol: moveToCol
	}

	// post request to move the selected piece on the board
	const request = new Request("/chessAction/movePiece", {
		method: "post",
		body: JSON.stringify(toMove),
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json"
		}
	})

	let json = null;
	try {
		const res = await fetch(request);
		if (res.status === 200) {
			json = await res.json();

			if (json.validMove) {
				updateBoard(board, json.newBoard);

				board.setState({
					selectedRow: newSelectedRow,
					selectedCol: newSelectedCol,
					prevSelectedTile: null
				})
			}
			if (json.winner !== "empty") {
				alert(`Winner is: ${json.winner}`);
			}
		} else {
			console.log(`Status code: ${res.status}`);
		}

		return json.validMove;

	} catch (error) {
		// simple error handling for now
		console.log(error);
	}

	return false;
}

export const getAIMove = async (board) => {
	const url = "/chessAction/getAIMove";

	let json = null;
	try {
		const res = await fetch(url);
		if (res.status === 200) {
			json = await res.json();
			updateBoard(board, json.newBoard);

			if (json.winner !== "empty") {
				alert(`Winner is: ${json.winner}`);
			}
		} else {
			console.log(`Status code: ${res.status}`);
		}
	} catch (error) {
		console.log(error);
	}
}

// reset the game
export const resetGameBoard = async (board) => {
	// post request to initialize the board
	const request = new Request("/chessAction/gameReset", {
		method: "post",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json"
		}
	})

	let json = null;
	try {
		const res = await fetch(request);
		if (res.status === 200) {
			json = await res.json();

			updateBoard(board, json.newBoard);

			board.setState({
				selectedRow: -1,
				selectedCol: -1,
				prevSelectedTile: null
			})
		} else {
			console.log(`Status code: ${res.status}`);
		}

	} catch (error) {
		// simple error handling for now
		console.log(error);
	}
}