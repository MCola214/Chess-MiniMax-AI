"use strict";
const log = console.log;

const fs = require('fs');
const express = require("express");
// starting the express server
const app = express();
const path = require('path');

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set('useFindAndModify', false); // for some deprecation issues

// import the mongoose models
const { ChessBoard } = require("./models/chess/ChessBoard");

// to validate object IDs
const { ObjectID } = require("mongodb");

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// express-session for managing user sessions
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));

// to be able to simulate the chess game
const MakeChessGame = require("./chess/chess");

// for development testing, would need to be removed in a production environment
const assert = require("assert");

/*** Session handling **************************************/
// Create a session and session cookie
app.use(
	session({
		secret: "our hardcoded secret",
		resave: false,
		saveUninitialized: false,
		cookie: {
			expires: 1000 * 60 * 60 * 8,
			httpOnly: true
		}
	})
);

/*** Chess Game helper functions *****************************/
const createNewChessBoard = () => {
	const gameObject = {};
	for (let i = 0; i < 8; i++) {
		const row = {};
		for (let j = 0; j < 8; j++) {
			switch (i) {
				case 0:
					if (j === 0 || j === 7) {
						row[j] = { colour: "black", type: "rook", hasMoved: false };
					} else if (j === 1 || j === 6) {
						row[j] = { colour: "black", type: "knight", hasMoved: false };
					} else if (j === 2 || j === 5) {
						row[j] = { colour: "black", type: "bishop", hasMoved: false };
					} else if (j === 3) {
						row[j] = { colour: "black", type: "queen", hasMoved: false };
					} else if (j === 4) {
						row[j] = { colour: "black", type: "king", hasMoved: false };
					}
					break;
				case 1:
					row[j] = { colour: "black", type: "pawn", hasMoved: false };
					break;
				case 6:
					row[j] = { colour: "white", type: "pawn", hasMoved: false };
					break;
				case 7:
					if (j === 0 || j === 7) {
						row[j] = { colour: "white", type: "rook", hasMoved: false };
					} else if (j === 1 || j === 6) {
						row[j] = { colour: "white", type: "knight", hasMoved: false };
					} else if (j === 2 || j === 5) {
						row[j] = { colour: "white", type: "bishop", hasMoved: false };
					} else if (j === 3) {
						row[j] = { colour: "white", type: "queen", hasMoved: false };
					} else if (j === 4) {
						row[j] = { colour: "white", type: "king", hasMoved: false };
					}
					break;
				default:
					row[j] = { colour: "empty", type: "empty", hasMoved: false };
			}
		}
		gameObject[i] = row;
	}

	return gameObject;
}


/*** Chess Game actions **************************************/

// A route to create a game session
app.post("/chessAction/gameInit", async (req, res) => {
	const currentGame = await ChessBoard.findOne({ sessionID: req.sessionID });
	if (!currentGame) {
		// create new board
		const gameObject = createNewChessBoard();

		// save cookie session to ChessBoard db model
		gameObject["sessionID"] = req.sessionID;

		// initialize board to have white go first
		gameObject["userColour"] = "white";
		gameObject["playerTurn"] = "white";

		gameObject["winner"] = "empty";

		// save board to db and send to client
		try {
			// new game
			const game = new ChessBoard(gameObject);

			const result = await game.save();
			req.session.gameId = result._id;

			// get new game from db
			const newGame = await ChessBoard.findById(req.session.gameId);

			res.send(newGame);
		} catch (error) {
			console.log(`Error in /chessAction/gameInit:`);
			console.log(error);
			res.status(400).send('Bad Request');
		}
	} else {
		// user has a session, send saved board from db
		res.send(currentGame);
	}
});

// A route to move a piece
app.post("/chessAction/movePiece", async (req, res) => {
	const moveToRow = req.body.moveToRow;
	const moveToCol = req.body.moveToCol;
	const selectedRow = req.body.selectedRow;
	const selectedCol = req.body.selectedCol;
	try {
		const gameObject = await ChessBoard.findById(req.session.gameId);

		const ChessGame = new MakeChessGame(gameObject);
		const moveResult = ChessGame.movePiece(selectedRow, selectedCol, moveToRow, moveToCol);
		if (moveResult.validMove) {
			const updatedGameBoard = await ChessBoard.updateOne(
				{ _id: req.session.gameId },
				{ $set: moveResult.updatedGameObject }
			)
		}

		const newGameBoard = await ChessBoard.findById(req.session.gameId);

		res.send({ validMove: moveResult.validMove, newBoard: newGameBoard, winner: moveResult.winner });
	} catch (error) {
		console.log(`Error in /chessAction/movePiece:`);
		console.log(`\tmoveToRow: ${moveToRow}`);
		console.log(`\tmoveToCol: ${moveToCol}`);
		console.log(`\tselectedRow: ${selectedRow}`);
		console.log(`\tselectedCol: ${selectedCol}\n`);
		console.log(error);
		res.status(400).send('Bad Request');
	}
});

// A route to get the AI's move
app.get("/chessAction/getAIMove", async (req, res) => {
	try {
		const gameObject = await ChessBoard.findById(req.session.gameId);

		const ChessGame = new MakeChessGame(gameObject);
		const AIMove = ChessGame.getAIMove();

		if (AIMove.validMove) {
			const updatedGameBoard = await ChessBoard.updateOne(
				{ _id: req.session.gameId },
				{ $set: AIMove.updatedGameObject }
			)
		}

		const newGameBoard = await ChessBoard.findById(req.session.gameId);
		res.send({ newBoard: newGameBoard, winner: AIMove.winner });
	} catch (error) {
		console.log(`Error in /chessAction/getAIMove:`);
		console.log(error);
		res.status(400).send('Bad Request');
	}
});

// A route to reset the game board
app.post("/chessAction/gameReset", async (req, res) => {
	try {
		// create new board
		const gameObject = createNewChessBoard();

		// initialize board to have white go first
		gameObject["userColour"] = "white";
		gameObject["playerTurn"] = "white";

		gameObject["winner"] = "empty";

		const updatedGameBoard = await ChessBoard.updateOne(
			{ _id: req.session.gameId },
			{ $set: gameObject }
		)

		const newGameBoard = await ChessBoard.findById(req.session.gameId);
		res.send({ newBoard: newGameBoard });
	} catch (error) {
		console.log(`Error in /chessAction/gameReset:`);
		console.log(error);
		res.status(400).send('Bad Request');
	}
});




/*** Webpage routes below **********************************/
// Serve the build
app.use(express.static(path.join(__dirname, "/client/build")));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
	// check for page routes that we expect in the frontend to provide correct status code.
	const goodPageRoutes = ["/", "/chess"];
	if (!goodPageRoutes.includes(req.url)) {
		// if url not in expected page routes, set status to 404.
		res.status(404);
	}

	// send index.html
	res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000;
app.listen(port, () => {
	log(`Listening on port ${port}...`);
});
