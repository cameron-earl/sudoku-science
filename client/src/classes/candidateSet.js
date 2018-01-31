export default class CandidateSet {
	//constructors

	constructor(startingValue = 0) {
		//normal constuctor
		if (typeof startingValue === 'number') {
			this._candidates = new Array(9)
			this.solvedValue = startingValue //also updates candidates
		} else if (startingValue instanceof CandidateSet) {
			//copy constructor
			this.solvedValue = startingValue.solvedValue
			this._candidates = startingValue.candidates
		} else {
			throw new Error('Constructor must take number or CandidateSet')
		}
	}

	//getters and setters
	get candidateBoolArr() {
		return this._candidates
	}

	get solvedValue() {
		return this._solvedValue
	}

	set solvedValue(val) {
		if (val < 0 || val > 9) throw new Error('Solved value out of range')
		this._candidates.fill(!val)
		if (val > 0) {
			this._candidates[val - 1] = true
		}
		this._solvedValue = val
	}

	//public methods

	toString() {
		return this._candidates.reduce((str, c, i) => (c ? str + (i + 1) : ''), '')
	}

	count() {
		let sum = this._candidates.reduce((a, b) => a + b)
		if (!sum) throw new Error('Cell has no remaining candidates')
		if (sum === 1) this._updateSolvedValue()
		return sum
	}

	contains(val) {
		return !!this._candidates[val - 1]
	}

	equals(other) {
		return (
			other instanceof CandidateSet &&
			this._candidates === other._candidates &&
			this.solvedValue === other.solvedValue
		)
	}

	eliminateCandidate(val) {
		if (val < 1 || val > 9) throw new Error('Eliminate Candidate out of range')
		if (!this._candidates[val - 1] || this.count() === 1) return false
		this._candidates[val - 1] = false
		this._updateSolvedValue()
		return true
	}

	enableCandidate(val) {
		if (val < 1 || val > 9) throw new Error('Eliminate Candidate out of range')
		if (this._candidates[val - 1]) return false
		this._candidates[val - 1] = true
		this._solvedValue = 0
		return true
	}

	setCandidate(val, bool) {
		return bool ? this.enableCandidate(val) : this.eliminateCandidate(val)
	}

	//e.g. [1,5,8,9]
	getCandidateArray() {
		return this._candidates.reduce(
			(arr, c, i) => (c ? [...arr, i + 1] : arr),
			[],
		)
	}

	//only called when count === 1
	_updateSolvedValue() {
		let candidates = this.getCandidateArray()
		if (!candidates.length) throw new Error("Couldn't find a valid candidate")
		if (candidates.length === 1) this._solvedValue = candidates[0]
	}
}
