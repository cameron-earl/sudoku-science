import React, { Component } from 'react'
import './App.css'
// import Board from './classes/board.js'
// import BoardDisplay from './components/BoardDisplay.js'
import Solving from './components/Solving.js'

class App extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					{/* <h1 className="App-title">
						Sudoku<i className="icon-beaker" />Science
					</h1> */}
					<img src="./cameron2.svg" alt="Sudoku Science" className="logo" />
				</header>
				<Solving />
			</div>
		)
	}
}

export default App
