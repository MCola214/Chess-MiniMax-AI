const Piece = require("./Piece");

class Pawn extends Piece {
	constructor(row, col, colour, hasMoved) {
		super(row, col, colour, "pawn", hasMoved);
		this.value = 1;
	}

	copy() {
		const copy = JSON.parse(JSON.stringify(this));
		return new Pawn(copy.row, copy.col, copy.colour, copy.hasMoved);
	}

	getMoveList(board) {
		const moveList = [];
		const moveDirection = this.colour === "white" ? -1 : 1;

		// Pawn moving without attacking
		let validSpace = this.checkValidSpace(this.row + moveDirection);
		if (validSpace && board.spaceEmpty(this.row + moveDirection, this.col)) {
			let moveType = 0;
			if (this.colour === "white" && (this.row + moveDirection) === 0) {
				moveType = 3;
			} else if (this.colour === "black" && (this.row + moveDirection) === 7) {
				moveType = 3;
			}
			moveList.push([this.row + moveDirection, this.col, moveType]);

			// check two rows ahead only if space in front is empty
			validSpace = this.checkValidSpace(this.row + 2 * moveDirection);
			if (validSpace && (!this.hasMoved) && (board.spaceEmpty(this.row + 2 * moveDirection, this.col))) {
				moveList.push([this.row + 2 * moveDirection, this.col, 0]);
			}
		}

		// Pawn attacking diagonals
		const attackRow = this.row + moveDirection;
		[-1, 1].forEach(i => {
			const attackCol = this.col + i;
			const attackValidSpace = this.checkValidSpace(attackRow) && this.checkValidSpace(attackCol);
			if (attackValidSpace && !board.spaceEmpty(attackRow, attackCol)) {
				const attackPiece = board.getPiece(attackRow, attackCol);
				if (this.colour !== attackPiece.colour) {
					moveList.push([attackRow, attackCol, 0]);
				}
			}
		})

		return moveList;
	}
}

module.exports = Pawn;