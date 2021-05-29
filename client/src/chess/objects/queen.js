import chessPiece from "./chessPieces";
import piecePictureWhite from "../assets/chess_piece_sprite_01.png";
import piecePictureBlack from "../assets/chess_piece_sprite_07.png";

class Queen extends chessPiece {
	constructor(row, col, colour) {
		super(row, col, colour, "queen");
		this.pic = (this.colour === "white") ? piecePictureWhite : piecePictureBlack;
	}
}

export default Queen