const Piece = require("./Piece");

class Knight extends Piece {
	constructor(row, col, colour, hasMoved) {
		super(row, col, colour, "knight", hasMoved);
		this.value = 3;
	}

	copy() {
		const copy = JSON.parse(JSON.stringify(this));
		return new Knight(copy.row, copy.col, copy.colour, copy.hasMoved);
	}

	getMoveList(board) {
		const moveList = [];

		// check from current position to each set of diagonal, vertical, and horizontal lines
		[[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [-1, 2], [1, -2], [-1, -2]].forEach(tuple => {
			const checkRow = this.row + tuple[0];
			const checkCol = this.col + tuple[1];

			const validSpace = this.checkValidSpace(checkRow) && this.checkValidSpace(checkCol);
			if (validSpace) {
				if (board.spaceEmpty(checkRow, checkCol)) {
					moveList.push([checkRow, checkCol, 0]);
				} else {
					const attackPiece = board.getPiece(checkRow, checkCol);
					if (this.colour !== attackPiece.colour) {
						moveList.push([checkRow, checkCol, 0]);
					}
				}
			}
		})

		return moveList;
	}
}

module.exports = Knight;