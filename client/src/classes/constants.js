const Constants = {
	boardLength: 9,
	totalCellCount: this.boardLength * this.boardLength,
	totalHouseCount: this.boardLength * 3,
	solveMethods: {
		unsolved: 1,
		provided: 2,
		playerInput: 3,
		simpleNakedSingle: 3.5,
		nakedSingle: 4,
		hiddenSingle: 5,
		nakedPair: 6,
		hiddenPair: 7,
		// intersectionRemoval: 8,
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
