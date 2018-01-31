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
		boardStr:
			'186573294392000000457209006941000568785496123623800040279000001138000070564000082',
		board: null,
		solver: null,
	}

	componentDidMount = () => {
		let board = new Board(this.state.boardStr)
		let solver = new Solver(board)
		this.setState({ board, solver })
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
		console.log('New Puzzle', randomIndex, newPuzzle)
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
		if (this.state.solver.userToggleCellCandidate(cellId, value))
			this.refreshBoard()
	}

	render() {
		console.log(this.state)
		return !this.state.solver ? (
			'loading...'
		) : (
			<Container>
				<BoardDisplay
					board={this.state.solver.board}
					toggleCandidate={this.toggleCandidate}
					setCellValue={this.setCellValue}
				/>
				<div className="button-group">
					<Button
						waves="light"
						className="amber darken-4"
						onClick={this.solveOneStep}
					>
						Solve One Step<Icon right>add</Icon>
					</Button>
					<Button
						className="amber darken-4"
						waves="light"
						onClick={this.solvePuzzle}
					>
						Solve Puzzle<Icon right>send</Icon>
					</Button>
					<Button
						className="amber darken-4"
						waves="light"
						onClick={this.componentDidMount}
					>
						Reset<Icon right>cached</Icon>
					</Button>
					<Button
						className="amber darken-4"
						waves="light"
						onClick={this.setNewPuzzle}
					>
						New Puzzle<Icon right>cached</Icon>
					</Button>
					<Button
						className="green darken-4"
						waves="light"
						onClick={this.findNonUnique}
					>
						Test Puzzles<Icon right>cached</Icon>
					</Button>
					<Button
						className="green darken-4"
						waves="light"
						onClick={this.setEmptyPuzzle}
					>
						Blank Puzzle<Icon right>cached</Icon>
					</Button>
				</div>
			</Container>
		)
	}
}

export default Solving
