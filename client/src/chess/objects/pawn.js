import chessPiece from "./chessPieces";
import piecePictureWhite from "../assets/chess_piece_sprite_05.png";
import piecePictureBlack from "../assets/chess_piece_sprite_11.png";

class Pawn extends chessPiece {
	constructor(row, col, colour) {
		super(row, col, colour, "pawn");
		this.pic = (this.colour === "white") ? piecePictureWhite : piecePictureBlack;
	}
}

export default Pawn