import React, { Component } from 'react'
// import './BoardDisplay.css'
// import Board from '../classes/board.js'
// import Constants from '../classes/constants.js'

class CandidateGrid extends Component {
	handleCandidateClick = ev => {
		let candidate = +ev.target.getAttribute('val')
		this.props.toggleCandidate(this.props.cellId, candidate)
	}

	render() {
		let candidates = this.props.candidates
		//transform 1x9 arr to 3x3 arr
		let candidateMatrix = new Array(3).fill('').map(row => [' ', ' ', ' '])
		for (let i = 0; i < candidates.length; i++) {
			candidateMatrix[Math.floor(i / 3)][i % 3] = candidates[i]
		}
		let tableRows = candidateMatrix.map((row, i) => (
			<tr className="candidate-row" key={i}>
				{row.map((cell, j) => (
					<td
						onClick={this.handleCandidateClick}
						className="candidate-cell"
						key={i * 3 + j}
						val={i * 3 + j + 1}
					>
						{cell ? i * 3 + j + 1 : ' '}
					</td>
				))}
			</tr>
		))
		return (
			<table className="candidate-table">
				<tbody>{tableRows}</tbody>
			</table>
		)
	}
}

export default CandidateGrid
