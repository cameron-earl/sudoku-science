import React, { Fragment, Component } from 'react'
import './BoardDisplay.css'
import CandidateGrid from './CandidateGrid'
import WrongGuess from './WrongGuess'
// import Board from '../classes/board.js'
import Constants from '../classes/constants.js'
import { Button, Icon } from 'react-materialize'

class BoardDisplay extends Component {
	state = {
		showCandidates: false,
		activeCellId: null,
		incorrectGuesses: 0,
		showWrongGuessFlash: false,
	}

	componentDidMount = () => {
		window.addEventListener('keydown', this.handleKeyPress)
	}

	toggleCandidateView = ev => {
		this.setState({ showCandidates: !this.state.showCandidates })
	}

	handleCellClick = ev => {
		let id = +ev.target.getAttribute('id')
		this.setState({ activeCellId: id })
	}

	handleKeyPress = ev => {
		let key = +ev.which
		console.log(key)
		if (this.state.activeCellId !== null) {
			if (key >= 48 && key <= 57) {
				//number keys
				key -= 48
				if (this.state.showCandidates) {
					this.props.toggleCandidate(this.state.activeCellId, key)
				} else {
					this.props.setCellValue(this.state.activeCellId, key)
				}
			} else if (key >= 37 && key <= 40) {
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
				let activeCellId = (81 + modifier + this.state.activeCellId) % 81
				this.setState({ activeCellId })
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
		let { showCandidates } = this.state
		let boardTableRows = board.rows.map((row, r) => (
			<tr key={r}>
				{row.cells.map((cell, c) => {
					let displayStuff = cell.value ? (
						cell.value
					) : showCandidates ? (
						<CandidateGrid
							cellId={cell.id}
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
							id={cell.id}
							onClick={this.handleCellClick}
							className={
								solveMethod +
								' cell' +
								(cell.id === this.state.activeCellId ? ' active' : '')
							}
						>
							{displayStuff}
						</td>
					)
				})}
			</tr>
		))
		return (
			<Fragment>
				<WrongGuess />
				<table className="board">
					<tbody>{boardTableRows}</tbody>
				</table>
				<Button
					className="green darken-4"
					waves="light"
					onClick={this.toggleCandidateView}
				>
					{showCandidates ? 'Hide Candidates' : 'Show Candidates'}
					<Icon right>cached</Icon>
				</Button>
			</Fragment>
		)
	}
}

export default BoardDisplay
