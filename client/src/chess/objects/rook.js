import chessPiece from "./chessPieces";
import piecePictureWhite from "../assets/chess_piece_sprite_02.png";
import piecePictureBlack from "../assets/chess_piece_sprite_08.png";

class Rook extends chessPiece {
	constructor(row, col, colour) {
		super(row, col, colour, "rook");
		this.pic = (this.colour === "white") ? piecePictureWhite : piecePictureBlack;
	}
}

export default Rook