import House from './house.js'

export default class Column extends House {
	constructor(houseNumber) {
		super(houseNumber)
		this._houseType = House.houseTypes.column
	}

	toString() {
		let colString = this.houseNumber + '\n'
		for (let i = 0; i < 9; i++) {
			colString += i % 3 ? '─\n' : '═\n'
			colString += this.cells[i] + '\n'
		}
		return colString + '═\n'
	}
}
