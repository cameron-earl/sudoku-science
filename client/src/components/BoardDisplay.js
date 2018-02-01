import React, { Fragment, Component } from 'react'
import './BoardDisplay.css'
import CandidateGrid from './CandidateGrid'
import WrongGuess from './WrongGuess'
// import Board from '../classes/board.js'
import Constants from '../classes/constants.js'
import { Button, Icon, Row, Col } from 'react-materialize'

class BoardDisplay extends Component {
	state = {
		showCandidates: false,
		activeCellId: null,
		incorrectGuesses: 0,
		showWrongGuessFlash: false,
	}

	componentDidMount = () => {
		window.addEventListener('keydown', this.handleKeyPress)
		window.addEventListener('click', ev => {
			if (this.state.activeCellId) {
				this.setState({ activeCellId: null, activeVal: null })
			}
		})
	}

	toggleCandidateView = ev => {
		this.setState({ showCandidates: !this.state.showCandidates })
	}

	handleCellClick = ev => {
		ev.stopPropagation()
		let id = +ev.target.getAttribute('cell-id')
		let activeCell = this.props.board.getCell(id)
		this.setState({ activeCellId: id, activeVal: activeCell.value })
	}

	handleKeyPress = ev => {
		let key = +ev.which
		// console.log(key)
		let { activeCellId } = this.state
		let activeCell = activeCellId
			? this.props.board.getCell(activeCellId)
			: null

		if (key === 27) {
			//esc
			this.setState({ activeCellId: null })
		} else if (key === 16) {
			// shift
			this.toggleCandidateView()
		} else if (key === 82) {
			//r
			this.props.refresh()
		} else if (key === 78) {
			//n
			this.props.setNewPuzzle()
		} else if (key === 66) {
			//b
			this.props.setEmptyPuzzle()
		} else if (key === 83) {
			//s
			this.props.solveOneStep()
		} else if (key === 80) {
			//p
			this.props.solvePuzzle()
		} else if (activeCellId && key >= 37 && key <= 40) {
			// arrow keys
			ev.preventDefault()
			let modifier
			switch (key) {
				case 37: //left
					modifier = -1
					break
				case 38: //up
					modifier = -9
					break
				case 39: //right
					modifier = 1
					break
				case 40: //down
					modifier = 9
					break
				default:
					modifier = 0
			}
			let activeCellId = (80 + modifier + this.state.activeCellId) % 81 + 1
			let activeCell = this.props.board.getCell(activeCellId)
			let activeVal = activeCell.value ? activeCell.value : null
			this.setState({ activeCellId, activeVal })
		}
		if (key >= 49 && key <= 57) {
			//number keys
			let val = key - 48

			if (activeCellId && !activeCell.value) {
				if (this.state.showCandidates) {
					this.props.toggleCandidate(activeCellId, val)
				} else {
					this.props.setCellValue(activeCellId, val)
				}
				this.setState({ activeVal: activeCell.value })
			} else {
				this.setState({ activeCellId: null, activeVal: val })
			}
		}
	}
	// guessIncorrect = () => {
	// 	return console.log('Incorrect Guess!') //fires every time
	// 	this.setState({
	// 		incorrectGuesses: this.state.incorrectGuesses + 1,
	// 		showWrongGuessFlash: true,
	// 	})
	// 	this.flashErrorScreen()
	// }

	flashErrorScreen = () => {
		let element = document.querySelector('.wrong-guess')
		console.log(element)
		var op = 1 // initial opacity
		element.style.zIndex = '100'
		var timer = setInterval(function() {
			if (op <= 0.1) {
				clearInterval(timer)
				op = 0
				element.style.zIndex = '-100'
			}
			element.style.opacity = op
			op -= 0.1
		}, 500)
	}

	render() {
		let { board } = this.props
		let { showCandidates, activeCellId, activeVal } = this.state
		let boardTableRows = board.rows.map((row, r) => (
			<tr key={r}>
				{row.cells.map((cell, c) => {
					let displayStuff = cell.value ? (
						cell.value
					) : showCandidates ? (
						<CandidateGrid
							cellId={cell.id}
							selected={cell.id === activeCellId}
							candidates={cell.candidates.candidateBoolArr}
							toggleCandidate={this.props.toggleCandidate}
						/>
					) : (
						' '
					)
					let solveMethod = Constants.reversedSolveMethods[cell.solveMethod]
					return (
						<td
							key={r + ':' + c}
							cell-id={cell.id}
							onClick={this.handleCellClick}
							className={
								solveMethod +
								' cell' +
								(cell.id === activeCellId ? ' active' : '') +
								(activeVal &&
								(cell.couldBe(activeVal) || cell.value === activeVal)
									? ' possible'
									: '')
							}
						>
							{displayStuff}
						</td>
					)
				})}
			</tr>
		))
		return (
			<div className="flex-row">
				<div className="sudoku-container">
					<table className="board">
						<tbody>{boardTableRows}</tbody>
					</table>
				</div>
				<div className="sidebar">
					<Button
						className="green accent-4"
						waves="light"
						onClick={this.toggleCandidateView}
					>
						{showCandidates ? 'Hide ' : 'Show '}
						Notes (⇧)
						<Icon left>apps</Icon>
					</Button>
					<Button
						className="green accent-4"
						waves="light"
						onClick={this.props.refresh}
					>
						<span className="u">R</span>eset<Icon left>refresh</Icon>
					</Button>
					<Button
						className="green accent-4"
						waves="light"
						onClick={this.props.setNewPuzzle}
					>
						<span className="u">N</span>ew Puzzle<Icon left>cached</Icon>
					</Button>
					<Button
						className="green accent-4"
						waves="light"
						onClick={this.props.setEmptyPuzzle}
					>
						<span className="u">B</span>lank Puzzle<Icon left>grid_on</Icon>
					</Button>
					<Button
						waves="light"
						className="black"
						onClick={this.props.solveOneStep}
					>
						<span className="u">S</span>olve One <span className="u">S</span>tep<Icon
							left
						>
							add
						</Icon>
					</Button>
					<Button
						className="black"
						waves="light"
						onClick={this.props.solvePuzzle}
					>
						Solve <span className="u">P</span>uzzle<Icon left>send</Icon>
					</Button>
				</div>
			</div>
		)
	}
}

export default BoardDisplay
