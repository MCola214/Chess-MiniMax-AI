import chessPiece from "./chessPieces";
import piecePictureWhite from "../assets/chess_piece_sprite_03.png";
import piecePictureBlack from "../assets/chess_piece_sprite_09.png";

class Bishop extends chessPiece {
	constructor(row, col, colour) {
		super(row, col, colour, "bishop");
		this.pic = (this.colour === "white") ? piecePictureWhite : piecePictureBlack;
	}
}

export default Bishop