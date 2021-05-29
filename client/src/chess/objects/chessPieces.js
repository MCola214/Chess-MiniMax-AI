import enumCreator from "../../helperObjects/createEnum";

class chessPiece {
	constructor(row, col, colour, type) {
		this.row = row;
		this.col = col;

		const colours = new enumCreator(["white", "black"]);
		const pieceType = new enumCreator(["king", "queen", "rook", "bishop", "knight", "pawn"]);

		if (colours[colour] == null) {
			throw new Error(`Colour needs to be either black or white. You used value: ${colour}`);
		}
		this.colour = colour;

		if (pieceType[type] == null) {
			throw new Error(`Piece type ${type} is not an appropriate type.`);
		}
		this.type = type;

		this.pic = null;
	}
}

export default chessPiece;