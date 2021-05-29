import './App.css';
import React from "react";
import { Route, Switch, BrowserRouter } from 'react-router-dom';

// import views
import ChessGameView from "./chess/views/ChessGameView.js"

class App extends React.Component {
	render() {
		return (
			<div className="App">
				<BrowserRouter>
					<Switch>
						<Route
							exact path={["/", "/chess"]}
							render={props => (
								<div className="App">
									<ChessGameView {...props} app={this} player="white" />
								</div>
							)}
						/>
					</Switch>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
