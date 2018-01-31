import House from './house.js'

export default class Box extends House {
	constructor(houseNumber) {
		super(houseNumber)
		this._houseType = this.houseTypes.box
	}

	toString() {
		let houseIndex = this.houseNumber - 1
		let isTop = houseIndex <= 2
		let isBottom = houseIndex >= 6
		let isRight = houseIndex % 3 === 2
		let isLeft = houseIndex % 3 === 0
		let topLeft = isLeft ? (isTop ? '╔' : '╠') : isTop ? '╦' : '╬'
		let topRight = isRight ? (isTop ? '╗' : '╣') : isTop ? '╦' : '╬'
		let bottomLeft = isLeft ? (isBottom ? '╚' : '╠') : isBottom ? '╩' : '╬'
		let bottomRight = isRight ? (isBottom ? '╝' : '╣') : isBottom ? '╩' : '╬'
		let leftSide = isLeft ? '╠' : '╬'
		let rightSide = isRight ? '╣' : '╬'
		let top = isTop ? '╦' : '╬'
		let bottom = isBottom ? '╩' : '╬'

		let topEdge = `${topLeft}═══${top}═══${top}═══${topRight}\n`
		let divider = `${leftSide}───┼───┼───${rightSide}\n`
		let bottomEdge = `${bottomLeft}═══${bottom}═══${bottom}═══${bottomRight}\n`
		let boxString = topEdge
		for (let row = 0; row < 3; row++) {
			boxString += '║ '
			for (let col = 0; col < 3; col++) {
				boxString += `${this.cells[row * 3 + col]} `
				boxString += col < 2 ? '│ ' : '║\n'
			}
			boxString += row < 2 ? divider : bottomEdge
		}
		return boxString
	}
}
