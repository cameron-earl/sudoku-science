import Constants from './constants.js'
import Cell from './cell.js'
import House from './house.js'

export default class Solver {
	constructor(board) {
		if (!board) {
			throw new Error('Cannot initialize a new Solver without a board!')
		}
		this._board = board
		this._moveCounts = {}
		this._actionLog = []
		for (let method in Constants.solveMethods) {
			if (Constants.solveMethods[method] > Constants.solveMethods.provided) {
				this._moveCounts[method] = 0
			}
		}
	}

	//getters and setters

	get board() {
		return this._board
	}

	get moveCounts() {
		return this._moveCounts
	}

	//public methods

	solveEasiestMove(maxSolveMethod) {
		//solves easiest move below and not including maxSolveMethod
		if (this.board.isSolved()) return false
		for (let method in Constants.solveMethods) {
			let methodVal = Constants.solveMethods[method]
			if (!this.board.isValid()) return false
			if (methodVal <= 3) continue
			if (methodVal >= maxSolveMethod) continue
			// console.log(method)
			if (this['_' + method]()) return true
		}
		return false
	}

	moveCountsToString() {
		return Object.keys(this.moveCounts)
			.filter(m => this.moveCounts[m])
			.reduce((s, m) => s + `${m} - ${this.moveCounts[m]}\n`, '')
	}

	solvePuzzle(maxSolveMethod = Infinity) {
		for (let i = 0; i < 500 && this.solveEasiestMove(maxSolveMethod); i++) {}
		console.log(this.board.toString(), this._actionLog)
		for (let move in this.moveCounts) {
			if (this.moveCounts[move])
				console.log(`${move}: ${this.moveCounts[move]}`)
		}
		if (
			!this.board.isSolved() &&
			this.board._solvedArr &&
			maxSolveMethod == Infinity //arbitrary high number
		) {
			for (let i = 0; i < 81; i++) {
				if (this.board.cells[i].value) continue
				this._setCellValue(
					this.board.cells[i],
					Constants.solveMethods.cheat,
					this.board._solvedArr[i],
				)
			}
		}
		return this.board.isSolved()
	}

	userSetCellValue(cellId, value) {
		let cell = this.board.getCell(cellId)
		if (cell.value) return false
		let solveMethod = Constants.solveMethods.playerInput
		return this._setCellValue(cell, solveMethod, value)
	}

	userToggleCellCandidate(cellId, value) {
		let cell = this.board.getCell(cellId)

		if (cell.value) {
			if (cell.solveMethod === Constants.solveMethods.provided) return false
			cell.value = 0
		}
		if (value !== 0)
			cell.candidates._candidates[value - 1] = !cell.candidates._candidates[
				value - 1
			]
	}

	//private methods

	_cellsWithThisCandidateArray(group, value) {
		return group.cells.filter(c => c.candidates.contains(value))
	}

	_addToLog(cell, actionType, value, solveMethod) {
		// console.log(this._actionLog)
		solveMethod = Constants.reversedSolveMethods[solveMethod]
		this._actionLog.push({
			cell: cell.getCoordinateToString(),
			actionType,
			value,
			solveMethod,
			board: this.board.toNumberString(),
		})
		// console.log(solveMethod)
		this._moveCounts[solveMethod]++
	}

	_setCellValue(cell, solveMethod, value = cell.candidates.solvedValue) {
		if (this.board.setCellValue(cell.id, value, solveMethod)) {
			this._addToLog(cell, 'solve', value, solveMethod)
			return true
		}
		return false
	}

	_eliminateCellCandidate(cell, value, solveMethod) {
		if (cell.candidates.eliminateCandidate(value)) {
			this._addToLog(cell, 'eliminate', value, solveMethod)
			return true
		}
		return false
	}

	_getIndexArray(n) {
		let indexes = []
		for (let i = 0; i < n; i++) {
			indexes[i] = i
		}
		return indexes
	}

	//updates array of increasing indexes to next valid permutation
	//e.g. _nextPermutation([1,3,4],5) => [2,3,4]
	//returns false if no valid permutation remains
	//max is the length of these indexes traverse
	_nextPermutation(indexes, max) {
		let len = indexes.length
		//find last index that can safely be incremented
		let changed = false
		for (let p = len - 1; !changed && p >= 0; p--) {
			if (indexes[p] < max - len + p) {
				indexes[p]++
				//value of incremented index in relation to position
				let basis = indexes[p] - p
				p++
				while (p < len) {
					indexes[p] = basis + p
					p++
				}
				return indexes
			}
		}
		return false
	}

	// given an array of cells in a house of type sharedHouseType,
	// return the second house they all share, or false if there isn't one
	_getSecondSharedHouse(cells, sharedHouseType) {
		let types = House.houseTypes
		const boxNum = cells[0].boxNumber
		const rowNum = cells[0].rowNumber
		const colNum = cells[0].columnNumber
		let shareBox = true
		let shareRow = true
		let shareCol = true
		for (let i = 1; i < cells.length; i++) {
			shareBox = shareBox && boxNum === cells[i].boxNumber
			shareRow = shareRow && rowNum === cells[i].rowNumber
			shareCol = shareCol && colNum === cells[i].colNumber
		}
		if (shareBox + shareCol + shareRow < 2) return false
		let secondSharedType
		switch (sharedHouseType) {
			case types.box:
				secondSharedType = shareRow ? types.row : types.column
				break
			case types.row:
				secondSharedType = shareBox ? types.box : types.column
				break
			case types.column:
				secondSharedType = shareRow ? types.row : types.box
				break
			default:
				throw new Error('Called _getSecondSharedHouse incorrectly')
		}
		let secondSharedHouse =
			secondSharedType === types.box
				? this.board.boxes[boxNum - 1]
				: secondSharedType === types.row
					? this.board.rows[rowNum - 1]
					: this.board.columns[colNum - 1]
		return secondSharedHouse
	}

	//solving methods

	// Find a house with 8 solved cells, and fill in the last.
	_simpleNakedSingle() {
		let solveMethod = Constants.solveMethods.simpleNakedSingle
		for (let house of this.board.houses) {
			let cells = house.getUnsolvedCells()
			if (cells.length === 1) {
				let cell = cells[0]
				return this._setCellValue(cell, solveMethod)
			}
		}
		return false
	}

	// Find a cell with only one possible candidate
	_nakedSingle() {
		let solveMethod = Constants.solveMethods.nakedSingle
		let cell = this.board.cells.find(c => !c.value && c.isSolved())
		if (cell === undefined) return false
		return this._setCellValue(cell, solveMethod)
	}

	// Find a house that contains only one cell with a particular candidate
	_hiddenSingle() {
		let solveMethod = Constants.solveMethods.hiddenSingle
		for (let house of this.board.houses) {
			for (let val = 1; val <= 9; val++) {
				let cells = house.getUnsolvedCellsWithCandidate(val)
				if (cells.length !== 1) continue
				let cell = cells[0]
				return this._setCellValue(cell, solveMethod, val)
			}
		}
		return false
	}

	_intersectionRemoval() {
		const solveMethod = Constants.solveMethods.intersectionRemoval
		for (let house of this.board.houses) {
			let changed = false
			for (let val = 1; !changed && val <= 9; val++) {
				let cells = house.getUnsolvedCellsWithCandidate(val)
				if (cells.length === 0 || cells.length > 3) continue
				//check to see if all cells share two houses
				let secondSharedHouse = this._getSecondSharedHouse(
					cells,
					house.houseType,
				)
				if (!secondSharedHouse) continue
				//remove candidates from all other cells in second house
				for (let cell of secondSharedHouse.cells) {
					if (!cells.includes(cell)) {
						changed =
							changed || this._eliminateCellCandidate(cell, val, solveMethod)
					}
				}
			}
			if (changed) return true
		}
	}

	_nakedPair() {
		this._nakedTuple(2, Constants.solveMethods.nakedPair)
	}

	_nakedTriple() {
		this._nakedTuple(3, Constants.solveMethods.nakedTriple)
	}

	_nakedQuad() {
		this._nakedTuple(4, Constants.solveMethods.nakedQuad)
	}

	_hiddenPair() {
		this._hiddenTuple(2, Constants.solveMethods.hiddenPair)
	}
	_hiddenTriple() {
		this._hiddenTuple(3, Constants.solveMethods.hiddenTriple)
	}
	_hiddenQuad() {
		this._hiddenTuple(4, Constants.solveMethods.hiddenQuad)
	}

	//helper methods
	_nakedTuple(n, solveMethod) {
		for (let house of this.board.houses) {
			if (house.isSolved) continue
			// cells can fit the pattern with a subset of the same n candidates
			let cells = house.getCellsWith2ToNCandidates(n)
			if (cells.length < n) continue
			let candidateArr = house.getAllCandidates()
			//if candidates <= n, there's nothing left to eliminate
			if (candidateArr <= n) continue
			//check if n cells match
			let indexes = this._getIndexArray(n)
			let theseCandidates = new Set()
			while (indexes) {
				theseCandidates.clear()
				for (let i = 0; theseCandidates.size <= n && i < n; i++) {
					for (let val of cells[indexes[i]].candidates.getCandidateArray()) {
						theseCandidates.add(val)
					}
				}
				if (theseCandidates.size === n) {
					//success! remove these candidates from all other cells
					let cellsToTrim = house.getUnsolvedCells()
					//Get all unsolved cells except selected cells
					for (let i = 0, j = 0; i < n && j < cellsToTrim.length; j++) {
						if (cellsToTrim[j].id === cells[indexes[i]].id) {
							cellsToTrim = [
								...cellsToTrim.slice(0, j),
								...cellsToTrim.slice(j + 1),
							]
							j--
							i++
						}
					}
					let changed = false
					for (let cell of cellsToTrim) {
						for (let val of theseCandidates) {
							changed =
								changed || this._eliminateCellCandidate(cell, val, solveMethod)
						}
					}
					if (changed) return true
				}
				//update indexes so the next loop will check different cells in the house
				indexes = this._nextPermutation(indexes, cells.length)
			}
		}
		return false
	}

	//pick a house, any house
	//get a list of all unsolved cells
	//find all candidates that are found in <= n cells
	//if this count is less than n, continue to next house

	_hiddenTuple(n, solveMethod) {
		// iterate through houses
		for (let house of this.board.houses) {
			// get all house candidates that can be found in n or less cells
			let cands = []
			let unsolvedCells = house.getUnsolvedCells()
			for (let val = 1; val <= 9; val++) {
				if (
					!house.contains(val) &&
					house.getUnsolvedCellsWithCandidate(val) <= n
				) {
					cands.push(val)
				}
			}
			if (cands.length < n) continue
			//find a set of n cells that contain all of n cands
			//iterate through all permutations of cells and cands
			let indexes = this._getIndexArray(n)
			while (indexes) {
				let cellSet = new Set()
				for (let cell of unsolvedCells) {
					for (let index of indexes) {
						if (cell.couldBe(cands[index])) {
							cellSet.add(cell)
						}
					}
				}
				if (cellSet.size === n) {
					//Success! Remove all other cands from cells
					let chosenVals = indexes.map(i => cands[i])
					let changed = false
					for (let cell of cellSet) {
						for (let val = 1; val <= 9; val++) {
							if (chosenVals.contains(val)) continue
							if (
								cell.couldBe(val) &&
								this._eliminateCellCandidate(cell, val, solveMethod)
							) {
								changed = true
							}
						}
					}
					if (changed) return true
				}

				indexes = this._nextPermutation(indexes, cands.length)
			}
		}
		return false
	}
}
