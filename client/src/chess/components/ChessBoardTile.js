import React from "react";

class ChessBoardTile extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			row: this.props.row,
			col: this.props.col,
			tileStyle: {
				float: "left",
				width: 100,
				height: 100,
				background: this.props.tileColour
			},
			tileStyleSelected: {
				float: "left",
				width: 100,
				height: 100,
				background: "green"
			},
			imageStyle: {
				width: 100,
				height: 100
			},
			piece: this.props.piece,
			onClick: this.props.onClick,
			selectedRow: this.props.selectedRow,
			selectedCol: this.props.selectedCol
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const propsChanged = {};
		["row", "col", "piece", "onClick", "selectedRow", "selectedCol"].forEach(attribute => {
			if (nextProps[attribute] !== prevState[attribute]) {
				propsChanged[attribute] = nextProps[attribute];
			}
		})

		return propsChanged;
	}

	render() {
		const selected = this.state.row === this.state.selectedRow && this.state.col === this.state.selectedCol;
		const currentStyle = selected ? this.state.tileStyleSelected : this.state.tileStyle
		return (
			<div className="ChessBoardTile"
				style={currentStyle}
				onClick={() => this.state.onClick(this)}
			>
				{this.state.piece.pic ?
					<img alt="" src={this.state.piece.pic}
						style={this.state.imageStyle} />
					: null}
			</div>
		);
	}
}

export default ChessBoardTile;