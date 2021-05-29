import chessPiece from "./chessPieces";
import piecePictureWhite from "../assets/chess_piece_sprite_04.png";
import piecePictureBlack from "../assets/chess_piece_sprite_10.png";

class Knight extends chessPiece {
	constructor(row, col, colour) {
		super(row, col, colour, "knight");
		this.pic = (this.colour === "white") ? piecePictureWhite : piecePictureBlack;
	}
}

export default Knight