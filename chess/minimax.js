// Function to perform minimax game tree search with alphabeta pruning 
const AlphaBeta = (gameState, player, depth, alpha, beta) => {
	let bestMove = {};
	if (gameState.isPlayerWin()) {
		return { bestMove: bestMove, value: 9999 };
	} else if (gameState.isAIWin()) {
		return { bestMove: bestMove, value: -9999 };
	} else if (depth <= 0) {
		return { bestMove: bestMove, value: gameState.getScore() };
	}

	let value = player === "white" ? -999999 : 999999;

	const actionList = gameState.getLegalMoves(player);
	actionList.forEach((action, i) => {
		const nextGameState = gameState.copy();
		nextGameState.movePiece(action.selectedRow, action.selectedCol, action.moveToRow, action.moveToCol);
		const nextPlayer = player === "white" ? "black" : "white";
		const nextDepth = nextPlayer === "white" ? depth - 1 : depth;

		const abChildResult = AlphaBeta(nextGameState, nextPlayer, nextDepth, alpha, beta);

		if (player === "white") {
			if (value < abChildResult.value) {
				bestMove = action;
				value = abChildResult.value;
			}

			if (value >= beta) {
				return { bestMove: bestMove, value: value };
			}

			alpha = Math.max(alpha, value);
		} else if (player === "black") {
			if (value > abChildResult.value) {
				bestMove = action;
				value = abChildResult.value;
			}

			if (value <= alpha) {
				return { bestMove: bestMove, value: value };
			}

			beta = Math.min(beta, value);
		}
	})

	return { bestMove: bestMove, value: value };
}

module.exports = AlphaBeta;