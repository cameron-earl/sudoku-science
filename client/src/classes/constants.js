const Constants = {
	boardLength: 9,
	totalCellCount: this.boardLength * this.boardLength,
	totalHouseCount: this.boardLength * 3,
	solveMethods: {
		cheat: -1,
		unsolved: 1,
		provided: 2,
		playerInput: 3,
		simpleNakedSingle: 3.5,
		nakedSingle: 4,
		hiddenSingle: 5,
		nakedPair: 6,
		hiddenPair: 7,
		intersectionRemoval: 8,
		nakedTriple: 9,
		hiddenTriple: 10,
		nakedQuad: 11,
		hiddenQuad: 12,
		// xWing: 13,
		// simpleColoring: 14,
		// yWing: 15,
		// swordFish: 16,
		// xCycle: 17,
		// xyChain: 18,
		// threeMMedusa: 19,
		// jellyfish: 20,
		// avoidableRectangle: 21,
	},
	actionTypes: {
		solve: 1,
		eliminate: 2,
	},
	reversedSolveMethods: {},
	descriptions: {
		simpleNakedSingle:
			'Find a row, column or box that is missing one value, then fill it in!',
		nakedSingle:
			'Find a cell that could only be one value. "Show Notes" (shift key) makes this easy!',
		hiddenSingle:
			'Find a house (row, column or box) that has only one cell that could be a certain value. Selecting a solved cell of that number, or simply pressing that number on your keyboard, will make this much easier.',
		nakedPair:
			'Find two cells in the same "house" (row, column or box) that have only the same two candidates. No other cell in that house could possibly be one of those values. You can eliminate those candidates by selecting the cell, then clicking or typing the number.',
		hiddenPair:
			'Find a house (row, column or box) with two values that are only found in two cells. Those cells can only be those two values. All other possible values can be eliminated from those two cells.',
		nakedTriple:
			'Find three cells in the same house that have only the same three candidates between them. No other cell in that house could possibly be one of those values. NOTE: This is not just sets like [123],[123],[123], but also sets like [12],[13],[23].',
		hiddenTriple:
			'Find a house with three values that are only found between three cells. Those cells can only be one of those three values. All other possible values can be eliminated.',
		nakedQuad:
			'Find four cells in the same house that have only the same four candidates between them. No other cell in that house could possibly be one of those values. NOTE: This is not just sets like [1234],[1234],[1234],[1234] but also sets like [12],[23],[1234],[134].',
		hiddenQuad:
			'Find a house with four values that are only found between four cells. Those cells can only be one of those four values. All other possible values can be eliminated.',
		intersectionRemoval:
			'Find a house in which a candidate only appears in unsolved cells that share another house. Eliminate the candidate from the rest of the cells of the second house.',
	},
}

Constants.reversedSolveMethods = invert(Constants.solveMethods)

function invert(obj) {
	let newObj = {}
	for (let key in obj) {
		newObj[obj[key]] = key
	}
	return newObj
}
export default Constants
