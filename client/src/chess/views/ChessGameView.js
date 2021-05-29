import React from "react";

// import components
import ChessBoard from "../components/ChessBoard";

class ChessGameView extends React.Component {
	constructor(props) {
		super(props);
		this.props.history.push("/chess");

		this.state = {
			player: this.props.player
		}
	}

	render() {
		return (
			<div className="ChessGameView">
				<h1 className="ChessGameView-header">
					Welcome to Chess Minimax AI
				</h1>
				<ChessBoard {...this.props} />
			</div>
		);
	}
}

export default ChessGameView;