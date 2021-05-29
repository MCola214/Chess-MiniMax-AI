const mongoose = require('mongoose');

const ChessPieceSchema = new mongoose.Schema({
	colour: {
		type: String,
		enum: ["white", "black", "empty"],
		required: true,
		minlength: 1,
		trim: true
	},
	type: {
		type: String,
		enum: ["king", "queen", "rook", "bishop", "knight", "pawn", "empty"],
		required: true,
		minlength: 1,
		trim: true
	},
	hasMoved: {
		type: Boolean,
		required: true
	}
});

const ChessBoardRowSchema = new mongoose.Schema({
	0: ChessPieceSchema,
	1: ChessPieceSchema,
	2: ChessPieceSchema,
	3: ChessPieceSchema,
	4: ChessPieceSchema,
	5: ChessPieceSchema,
	6: ChessPieceSchema,
	7: ChessPieceSchema
});

const ChessBoardSchema = new mongoose.Schema({
	sessionID: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	userColour: {
		type: String,
		enum: ["white", "black"],
		required: true,
		minlength: 1,
		trim: true
	},
	playerTurn: {
		type: String,
		enum: ["white", "black"],
		required: true,
		minlength: 1,
		trim: true
	},
	winner: {
		type: String,
		enum: ["white", "black", "empty"],
		required: true,
		minlength: 1,
		trim: true
	},
	0: ChessBoardRowSchema,
	1: ChessBoardRowSchema,
	2: ChessBoardRowSchema,
	3: ChessBoardRowSchema,
	4: ChessBoardRowSchema,
	5: ChessBoardRowSchema,
	6: ChessBoardRowSchema,
	7: ChessBoardRowSchema
});

// make a model using the chess board schema
const ChessBoard = mongoose.model('ChessBoard', ChessBoardSchema)
module.exports = { ChessBoard }