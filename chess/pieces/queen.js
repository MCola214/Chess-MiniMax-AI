const Piece = require("./Piece");

class Queen extends Piece {
	constructor(row, col, colour, hasMoved) {
		super(row, col, colour, "queen", hasMoved);
		this.value = 9;
	}

	copy() {
		const copy = JSON.parse(JSON.stringify(this));
		return new Queen(copy.row, copy.col, copy.colour, copy.hasMoved);
	}

	getMoveList(board) {
		const moveList = [];

		// check from current position to each set of diagonal, vertical, and horizontal lines
		[[1, 1], [1, -1], [-1, -1], [-1, 1], [0, 1], [0, -1], [1, 0], [-1, 0]].forEach(tuple => {
			for (let i = 1; i < 8; i++) {
				const checkRow = this.row + i * tuple[0];
				const checkCol = this.col + i * tuple[1];

				const validSpace = this.checkValidSpace(checkRow) && this.checkValidSpace(checkCol);
				if (!validSpace) {
					break;
				}

				if (board.spaceEmpty(checkRow, checkCol)) {
					moveList.push([checkRow, checkCol, 0]);
				} else {
					const attackPiece = board.getPiece(checkRow, checkCol);
					if (this.colour !== attackPiece.colour) {
						moveList.push([checkRow, checkCol, 0]);
					}
					break;
				}
			}
		})

		return moveList;
	}
}

module.exports = Queen;