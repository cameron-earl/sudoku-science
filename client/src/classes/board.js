import House from './house.js'
import Row from './row.js'
import Column from './column.js'
import Box from './box.js'
import Cell from './cell.js'
import Constants from './constants.js'
import quickSolve from './quicksolve.js'

export default class Board {
	constructor(values) {
		if (typeof values === 'string') {
			values = [...values].map(Number).filter(n => !isNaN(n))
		}
		if (values.length !== 81)
			throw new Error('Provided array must have 81 values')

		if (Math.max(...values) > 9)
			throw new Error('Values must be between 0 and 9')

		this._solvedArr = false
		if (values.reduce((a, b) => a + b) > 50) {
			this._solvedArr = quickSolve.solve(values)
			// console.log('solution: ', this._solvedArr.join(''))
		}
		this._cells = []
		this._rows = []
		this._columns = []
		this._boxes = []
		this._houses = []

		for (let i = 0; i < 9; i++) {
			this.rows[i] = new Row(i + 1)
			this.columns[i] = new Column(i + 1)
			this.boxes[i] = new Box(i + 1)
			this.houses.push(this.rows[i])
			this.houses.push(this.columns[i])
			this.houses.push(this.boxes[i])
		}

		for (let i = 0; i < 81; i++) {
			let cell = new Cell(i + 1, values[i])
			this.cells[i] = cell
			this.rows[cell.rowNumber - 1].add(cell)
			this.columns[cell.columnNumber - 1].add(cell)
			this.boxes[cell.boxNumber - 1].add(cell)
		}

		for (let house of this.houses) {
			house.updateCandidates()
		}
	}

	//getters and setters

	get cells() {
		return this._cells
	}

	get rows() {
		return this._rows
	}

	get columns() {
		return this._columns
	}

	get boxes() {
		return this._boxes
	}

	get houses() {
		return this._houses
	}

	//public methods

	toString() {
		let boardString = '    1   2   3   4   5   6   7   8   9\n'
		boardString += '  ╔═══╦═══╦═══╦═══╦═══╦═══╦═══╦═══╦═══╗\n'

		for (let row = 0; row < 9; row++) {
			if (row === 3 || row === 6) {
				boardString += '  ╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣\n'
			}
			boardString += this.rows[row]
			if (row % 3 !== 2) {
				boardString += '  ╠───┼───┼───╬───┼───┼───╬───┼───┼───╣\n'
			}
		}
		return boardString + '  ╚═══╩═══╩═══╩═══╩═══╩═══╩═══╩═══╩═══╝'
	}

	toSimpleString() {
		let arr = []
		for (let row of this.rows) {
			arr.push(row.cells.reduce((str, c) => str + c.toString(), ''))
		}
		return arr.join('\n')
	}

	toNumberString() {
		return this.rows.reduce(
			(str, row) => str + row.cells.reduce((s, c) => s + c.value, ''),
			'',
		)
	}

	candidatesToString() {
		let str = ''
		for (let row = 1; row <= 9; row++) {
			// letter A -> I
			str += String.fromCharCode(64 + row) + ': '
			for (let col = 1; col <= 9; col++) {
				let cellId = Cell.getCellId(row, col)
				let cell = this.getCell(cellId)
				if (cell.value) continue
				let candidates = cell.candidates
				str += col + '('
				for (let val = 1; val <= 9; val++) {
					if (candidates.contains(val)) str += val
				}
				str += ') '
			}
			str += '\n'
		}
		return str
	}

	isSolved() {
		return this.cells.every(c => c.value)
	}

	isValid() {
		return this.houses.some(h => !h.isValid())
	}

	//takes number or coordinate string (e.g. 'A7')
	getCell(cellId) {
		if (typeof cellId === 'string') {
			let row = cellId.charCodeAt(0) - 64
			let col = Number(cellId[1])
			cellId = Cell.getCellid(row, col)
		}
		return this.cells[cellId - 1]
	}

	setCellValue(cellId, newValue, solveMethod) {
		if (
			solveMethod === Constants.solveMethods.playerInput &&
			(this._solvedArr && newValue !== this._solvedArr[cellId - 1])
		) {
			return false
		}
		if (this._solvedArr && newValue !== this._solvedArr[cellId - 1]) {
			throw new Error(
				`${solveMethod} tried to set ${cellId} to incorrect value!`,
			)
		}
		let cell = this.getCell(cellId)
		let row = this.rows[cell.rowNumber - 1]
		let col = this.columns[cell.columnNumber - 1]
		let box = this.boxes[cell.boxNumber - 1]

		//validate move legality
		if (cell.solveMethod === Constants.solveMethods.provided) {
			throw new Error('Tried to solve a cell with a provided value')
		}
		//left out several tests

		//change value and updatecandidates in its houses
		cell.value = newValue
		cell.solveMethod = solveMethod
		row.updateCandidates(newValue)
		col.updateCandidates(newValue)
		box.updateCandidates(newValue)
		return true
	}

	getShuffledCopyOfHouseArray() {
		// Fisher-Yates
		let a = this.houses.map(h => h)
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[a[i], a[j]] = [a[j], a[i]]
		}
		return a
	}

	isValueSolved(val) {
		if (val < 1 || val > 9) return false
		return this.rows.every(r => r.contains(val))
	}

	getHouse(houseType, index) {
		switch (houseType) {
			case House.houseTypes.row:
				return this.rows[index]
			case House.houseTypes.column:
				return this.columns[index]
			case House.houseTypes.box:
				return this.boxes[index]
			default:
				throw new Error('getHouse must be passed a valid housetype')
		}
	}

	// public static methods

	static randomCellId() {
		return Math.floor(Math.random() * 81) + 1
	}
}
