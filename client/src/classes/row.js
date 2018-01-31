import House from './house.js'

export default class Row extends House {
	constructor(houseNumber) {
		super(houseNumber)
		this._houseType = this.houseTypes.row
	}

	toString() {
		let str = `${String.fromCharCode(64 + this.houseNumber)} `

		for (let col = 0; col < 9; col++) {
			if (col % 3 === 0) str += '║ '
			else str += '│ '
			str += `${this.cells[col]} `
		}

		return str + '║\n'
	}
}
