class Piece {
	constructor(row, col, colour, type, hasMoved) {

		const validRow = this.checkValidSpace(row);
		const validCol = this.checkValidSpace(col);
		const validColour = this.checkValidColour(colour);
		const validType = this.checkValidType(type);

		if (!(validRow && validCol)) {
			throw new Error(`Invalid placement. Row: ${row}, Col: ${col}`);
		}

		if (!validColour) {
			throw new Error(`Colour needs to be either black or white. You used value: ${colour}`);
		}

		if (!validType) {
			throw new Error(`Piece type ${type} is not an appropriate type.`);
		}

		if (type === "empty" && type !== colour) {
			throw new Error(`Type and colour must either both be empty or neither. Type: ${type}, Colour: ${colour}`);
		}

		this.row = row;
		this.col = col;
		this.colour = colour;
		this.type = type;
		this.hasMoved = hasMoved;
		this.value = 0;
	}

	checkValidSpace(space) {
		const validSpaces = [0, 1, 2, 3, 4, 5, 6, 7];
		return validSpaces[space] === space;
	}

	checkValidColour(colour) {
		const validColours = ["white", "black", "empty"];
		return validColours.indexOf(colour) >= 0;
	}

	checkValidType(type) {
		const validType = ["king", "queen", "rook", "bishop", "knight", "pawn", "empty"];
		return validType.indexOf(type) >= 0;
	}

	copy() {
		const copy = JSON.parse(JSON.stringify(this));
		return new Piece(copy.row, copy.col, copy.colour, copy.type, copy.hasMoved);
	}

	// this function needs to be overwriten in each subclass
	getMoveList(board) {
		return [];
	}
}

// export default Piece;

module.exports = Piece;