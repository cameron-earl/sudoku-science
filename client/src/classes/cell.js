import CandidateSet from './candidateSet.js'
import Constants from './constants.js'

export default class Cell {
	//constructor
	constructor(id, value = 0) {
		this._id = id
		this._setHouses()
		this._candidates = new CandidateSet(value)
		console.log('fuck', this._candidates.getCandidateArray.length)
		this.value = value
		this.solveMethod = value
			? Constants.solveMethods.provided
			: Constants.solveMethods.unsolved
	}

	//getters and setters

	get id() {
		return this._id
	}

	get value() {
		return this._value
	}

	set value(value) {
		this.candidates.solvedValue = value
		this.hasChanged = true
		this._value = value
	}

	get rowNumber() {
		return this._rowNumber
	}

	get columnNumber() {
		return this._columnNumber
	}

	get boxNumber() {
		return this._boxNumber
	}

	get candidates() {
		return this._candidates
	}

	get hasChanged() {
		return this._hasChanged
	}

	set hasChanged(bool) {
		this._hasChanged = bool
	}

	get solveMethod() {
		return this._solveMethod
	}

	set solveMethod(solveMethod) {
		if (this.solveMethod === Constants.solveMethods.provided) {
			throw new Error('Tried to change solvemethod of a provided value')
		}
		this._solveMethod = solveMethod
	}

	//public methods

	isSolved() {
		return this._candidates.solvedValue !== 0
	}

	getCoordinateToString() {
		let rowLetter = String.fromCharCode(64 + this.rowNumber)
		return rowLetter + this.columnNumber
	}

	couldBe(val) {
		return this.value === val || (val > 0 && this.candidates.contains(val))
	}

	toString() {
		return this.value > 0 ? this.value.toString() : ' '
	}

	//public static methods

	static getRowNumber(cellId) {
		return Math.floor((cellId - 1) / 9) + 1
	}

	static getColumnNumber(cellId) {
		return (cellId - 1) % 9 + 1
	}

	static getBoxNumber(
		cellId,
		row = this.getRowNumber(cellId),
		col = this.getColumnNumber(cellId),
	) {
		let boxCol = Math.floor((col - 1) / 3)
		let boxRow = Math.floor((row - 1) / 3)
		return boxRow * 3 + boxCol + 1
	}

	static getCellId(row, col) {
		return (row - 1) * 9 + col
	}

	//private methods

	//initializes houses for cell
	_setHouses() {
		this._columnNumber = Cell.getColumnNumber(this.id)
		this._rowNumber = Cell.getRowNumber(this.id)
		this._boxNumber = Cell.getBoxNumber(
			this.id,
			this.rowNumber,
			this.columnNumber,
		)
	}
}
