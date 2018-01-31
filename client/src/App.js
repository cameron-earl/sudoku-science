import React, { Component } from 'react'
import './App.css'
// import Board from './classes/board.js'
// import BoardDisplay from './components/BoardDisplay.js'
import Solving from './components/Solving.js'
import { Container } from 'react-materialize'

class App extends Component {
	render() {
		return (
			<Container className="App">
				<header className="App-header">
					<h1 className="App-title">Sudoku</h1>
				</header>
				<Solving />
			</Container>
		)
	}
}

export default App
