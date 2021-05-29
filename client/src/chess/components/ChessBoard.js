import React from "react";

// import components
import ChessBoardTile from "../components/ChessBoardTile";
// import chessPiece from "../objects/chessPieces";
import { initializeBoard, movePiece, getAIMove, resetGameBoard } from "../actions/chessActions";

class ChessBoard extends React.Component {
	constructor(props) {
		super(props);
		initializeBoard(this);

		this.state = {
			boardStyle: {
				width: 800,
				height: 800,
				margin: "auto",
				border: 2,
				borderColor: "black",
				borderStyle: "solid",
				textAlign: "center"
			},
			rowStyle: {
				margin: 0,
				padding: 0,
				width: 800,
				height: 100
			},
			colStyle: {
				display: "inline-block",
				margin: 0,
				padding: 0
			},
			buttonStyle: {
				margin: "0.5%",
				display: "inline",
				backgroundColor: "#0AB5F0",
				width: "200px",
				height: "50px",
				border: "5px solid #3E63B2",
				borderRadius: "5px",
				textAlign: "center",
				color: "black",
				fontSize: "20px"
			},
			grid: [],
			selectedRow: -1,
			selectedCol: -1,
			prevSelectedTile: null
		}
	}

	getTileColour = (row, column) => {
		return (row % 2) ? (column % 2) : !(column % 2);
	}

	tileSelected = async (tile) => {
		if (this.state.prevSelectedTile === null) {
			// when no tile is selected

			if (this.props.player === tile.state.piece.colour) {
				// player has selected their own piece
				this.setState({
					selectedRow: tile.state.row,
					selectedCol: tile.state.col,
					prevSelectedTile: tile
				})

				tile.setState({
					selectedRow: tile.state.row,
					selectedCol: tile.state.col
				})
			}
		} else if (tile.state.row === this.state.selectedRow && tile.state.col === this.state.selectedCol) {
			// de-select the already selected tile
			this.setState({
				selectedRow: -1,
				selectedCol: -1,
				prevSelectedTile: null
			})

			tile.setState({
				selectedRow: -1,
				selectedCol: -1
			})
		} else {
			// user is moving a piece
			const moveResult = await movePiece(this, tile);
			if (moveResult) {
				getAIMove(this);
			}
		}
	}

	restartGame = () => {
		resetGameBoard(this);
	}

	render() {
		return (
			<div className="ChessGame">
				<div className="ChessBoard" style={this.state.boardStyle}>
					{this.state.grid.map((row, i) => {
						return <ul key={i} style={this.state.rowStyle}>
							{row.map((currentPiece, j) => {
								return <li key={i * 8 + j} style={this.state.colStyle}>
									<ChessBoardTile {...this.props}
										row={i}
										col={j}
										selectedCol={this.state.selectedCol}
										selectedRow={this.state.selectedRow}
										tileColour={this.getTileColour(i, j) ? "white" : "#56391C"}
										piece={currentPiece}
										onClick={this.tileSelected}
									/>
								</li>
							})}
						</ul>
					}
					)}
				</div>
				<button style={this.state.buttonStyle} onClick={() => this.restartGame()}>Restart Game</button>
			</div>

		);
	}
}

export default ChessBoard;