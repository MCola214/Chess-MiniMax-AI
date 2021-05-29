const Piece = require("./Piece");

class King extends Piece {
	constructor(row, col, colour, hasMoved) {
		super(row, col, colour, "king", hasMoved);
		this.value = 999;
	}

	copy() {
		const copy = JSON.parse(JSON.stringify(this));
		return new King(copy.row, copy.col, copy.colour, copy.hasMoved);
	}

	getMoveList(board) {
		const moveList = [];

		// check all spaces within one space around king
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				const checkRow = this.row + i;
				const checkCol = this.col + j;
				const validSpace = this.checkValidSpace(checkRow) && this.checkValidSpace(checkCol);
				if (!validSpace) {
					continue;
				}

				// can move if open space or attacking opponent
				if (board.spaceEmpty(checkRow, checkCol)) {
					moveList.push([checkRow, checkCol, 0]);
				} else {
					const attackPiece = board.getPiece(checkRow, checkCol);
					if (this.colour !== attackPiece.colour) {
						moveList.push([checkRow, checkCol, 0]);
					}
				}
			}
		}

		// check castling
		if (!this.hasMoved) {
			// check kingside castle
			const kingRookMoved = board.getPiece(this.row, 7).hasMoved;
			let kingsideEmpty = true;
			for (let i = 5; i <= 6; i++) {
				kingsideEmpty = kingsideEmpty && board.spaceEmpty(this.row, i);
			}
			if (!kingRookMoved && kingsideEmpty) {
				moveList.push([this.row, 6, 1]);
			}

			// check queenside castle
			const queenRookMoved = board.getPiece(this.row, 0).hasMoved;
			let queensideEmpty = true;
			for (let i = 1; i <= 3; i++) {
				queensideEmpty = queensideEmpty && board.spaceEmpty(this.row, i);
			}
			if (!queenRookMoved && queensideEmpty) {
				moveList.push([this.row, 2, 2]);
			}
		}

		return moveList;
	}
}

module.exports = King;