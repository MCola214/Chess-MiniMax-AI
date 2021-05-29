import chessPiece from "./chessPieces";
import piecePictureWhite from "../assets/chess_piece_sprite_00.png";
import piecePictureBlack from "../assets/chess_piece_sprite_06.png";

class King extends chessPiece {
	constructor(row, col, colour) {
		super(row, col, colour, "king");
		this.pic = (this.colour === "white") ? piecePictureWhite : piecePictureBlack;
	}
}

export default King