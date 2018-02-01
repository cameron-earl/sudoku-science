import React, { Fragment, Component } from 'react'
// import './BoardDisplay.css'
import Board from '../classes/board.js'
import Solver from '../classes/solver.js'
import BoardDisplay from './BoardDisplay.js'
import Puzzles from '../sudoku-boards/sudoku-boards.js'
import quickSolve from '../classes/quicksolve.js'
import Constants from '../classes/constants.js'
import { Container, Button, Icon } from 'react-materialize'

class Solving extends Component {
	state = {
		boardStr: null,
		board: null,
		solver: null,
	}

	componentDidMount = () => {
		let boardStr = this.state.boardStr
			? this.state.boardStr
			: this.getNewPuzzle()
		let board = new Board(boardStr)
		let solver = new Solver(board)
		this.setState({ boardStr, board, solver })
	}

	solvePuzzle = () => {
		this.state.solver.solvePuzzle()
		this.refreshBoard()
	}

	solveOneStep = () => {
		this.state.solver.solveEasiestMove()
		this.refreshBoard()
	}

	getNewPuzzle = () => {
		let randomIndex = Math.floor(Math.random() * Puzzles.length)
		let newPuzzle = Puzzles[randomIndex]
		return newPuzzle
	}

	setNewPuzzle = (ev, boardStr = this.getNewPuzzle()) => {
		this.setState({ boardStr: boardStr }, this.componentDidMount)
	}

	setEmptyPuzzle = () => {
		let boardStr =
			'000000000000000000000000000000000000000000000000000000000000000000000000000000000'
		this.setState({ boardStr }, this.componentDidMount)
	}

	refreshBoard = () => {
		this.setState({ board: this.state.solver.board })
	}

	findNonUnique = () => {
		for (let i = 0; i < Puzzles.length; i++) {
			if (i % 1000 === 0) console.log(i)
			let tests = quickSolve.testSuite(Puzzles[i])
			if (!tests.isValid || !tests.isUnique) console.log(i, tests)
		}
	}

	// toggleCandidate = (cellId, candidate) => {
	// 	let cell = this.state.board.getCell(cellId)
	// 	let changed = false
	// 	if (cell.couldBe(candidate)) {
	// 		changed = this.state.solver._eliminateCellCandidate(
	// 			cell,
	// 			candidate,
	// 			Constants.solveMethods.playerInput,
	// 		)
	// 	} else {
	// 		changed = cell.candidates.setCandidate(candidate, true)
	// 	}
	// 	if (changed) this.refreshBoard()
	// }

	setCellValue = (cellId, value) => {
		if (this.state.solver.userSetCellValue(cellId, value)) this.refreshBoard()
	}

	toggleCandidate = (cellId, value) => {
		this.state.solver.userToggleCellCandidate(cellId, value)
		this.refreshBoard()
	}

	render() {
		console.log(this.state)
		return !this.state.solver ? (
			'loading...'
		) : (
			<Container className="sudoku-container">
				<BoardDisplay
					className="sudoku-container"
					board={this.state.solver.board}
					toggleCandidate={this.toggleCandidate}
					setCellValue={this.setCellValue}
					refresh={this.componentDidMount}
					setNewPuzzle={this.setNewPuzzle}
					setEmptyPuzzle={this.setEmptyPuzzle}
					solveOneStep={this.solveOneStep}
					solvePuzzle={this.solvePuzzle}
				/>
			</Container>
		)
	}
}

export default Solving
