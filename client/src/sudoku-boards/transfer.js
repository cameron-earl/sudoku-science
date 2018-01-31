const fs = require('fs')
const quickSolve = require('../classes/quickSolve.js')

let lines = []
let promises = []
fs.readdir('./', (err, files) => {
	files.forEach(file => {
		if (file.slice(-4) === '.txt') {
			promises.push(getData(file))
		}
	})
	Promise.all(promises).then(arr => {
		let theseLines
		for (let data of arr) {
			theseLines = data
				.replace(/\./g, '0')
				.trim()
				.split('\n')
			for (let line of theseLines) {
				if (quickSolve.testUnique(line)) lines.push(line)
			}
			// lines = lines.concat(theseLines)
		}
		lines = [...new Set(lines)].sort((a, b) => a - b)
		console.log('# of sudoku puzzles:', lines.length)
		let fileContent =
			'const Puzzles = ' +
			JSON.stringify(lines, null, 2) +
			'\nexport default Puzzles'
		fs.writeFile('sudoku-boards.js', fileContent, err => {
			if (err) throw err
			console.log('Saved!')
		})
	})
})

function getData(fileName, type = 'utf8') {
	return new Promise(function(resolve, reject) {
		fs.readFile(fileName, type, (err, data) => {
			err ? reject(err) : resolve(data)
		})
	})
}
