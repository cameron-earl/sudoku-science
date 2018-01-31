export default class House {
	// ABSTRACT CLASS

	houseTypes = Object.freeze({
		row: 1,
		column: 2,
		box: 3,
	})

	constructor(houseNumber) {
		if (new.target === House) {
			throw new TypeError('House is an abstract class')
		}
		this._cells = []
		this.houseNumber = houseNumber
		this._isSolved = false
	}

	//getters and setters

	get houseType() {
		return this._houseType
	}

	get cells() {
		return this._cells
	}

	get houseNumber() {
		return this._houseNumber
	}

	set houseNumber(num) {
		this._houseNumber = num
	}

	get isSolved() {
		if (this._isSolved) return true
		if (!this.countUnsolvedCells) {
			this._isSolved = true
			return true
		}
		return false
	}

	//public methods

	add(cell) {
		if (this.cells.includes(cell)) return
		if (this.cells.length >= 9) {
			console.log(this.cells)
			throw new Error('Cannot add more than 9 cells to a house')
		}
		this._cells.push(cell)
	}

	updateCandidates(val) {
		let cells = this.cells
		if (!val) {
			for (let i = 0; i < cells.length; i++) {
				let val = cells[i].value
				if (!val) continue
				for (let j = 0; j < cells.length; j++) {
					if (i === j || cells[j].value) continue
					cells[j].candidates.eliminateCandidate(val)
				}
			}
		} else {
			for (let cell of cells) {
				if (!cell.value) cell.candidates.eliminateCandidate(val)
			}
		}
	}

	toString() {
		//ABSTRACT METHOD
		throw new Error('toString must be implemented!')
	}

	// compareTo(obj) { //needed in js?
	//   if (obj instanceof House) {
	//     return this.houseNumber - obj.houseNumber
	//   } else {
	//     return null
	//   }
	// }

	isValid() {
		if (this.cells.length !== 9) return false
		let solvedVals = this.cells.filter(c => c.value)
		return solvedVals.length === [...new Set(solvedVals)]
	}

	toSimpleString() {
		let str = `House: ${this.houseNumber} - `
		for (let cell of this.cells) {
			str += cell.toString()
		}
		return str
	}

	contains(val) {
		return this.cells.some(c => c.value === val)
	}

	countCellsWithCandidate(val) {
		return this.cells.reduce((count, cell) => count + cell.couldBe(val), 0)
	}

	getCellsWithCandidate(val) {
		return this.cells.filter(cell => cell.couldBe(val))
	}

	getUnsolvedCellsWithCandidate(val) {
		let foundCells = []
		if (this._isSolved) return []
		for (let cell of this.cells) {
			if (cell.value === val) return []
			if (cell.value) continue
			if (cell.couldBe(val)) foundCells.push(cell)
		}
		return foundCells
	}

	countUnsolvedCells() {
		if (this._isSolved) return 0
		else return this.cells.reduce((count, cell) => count + !cell.value, 0)
	}

	getUnsolvedCells() {
		return this._isSolved ? [] : this.cells.filter(c => !c.value)
	}

	getCellsWith2ToNCandidates(n) {
		if (this._isSolved) return []
		return this.cells.filter(c => {
			let count = c.candidates.count()
			return count >= 2 && count <= n
		})
	}

	//returns list of all candidates in house
	getAllCandidates() {
		let set = new Set()
		for (let i = 0; i < this.cells.length; i++) {
			if (this.cells[i].value) continue
			let candidates = this.cells[i].candidates.getCandidateArray()
			for (let val of candidates) {
				set.add(val)
			}
		}
		return [...set]
	}
}
