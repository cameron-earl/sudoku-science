import React, { Component } from 'react'
import Constants from '../classes/constants.js'

export default class MethodDescription extends Component {
	camelToNormalCase = str => {
		let spaced = str.replace(/([A-Z])/g, ' $1')
		return spaced.charAt(0).toUpperCase() + spaced.slice(1)
	}

	render() {
		let { reversedSolveMethods, descriptions } = Constants
		let { method } = this.props
		return method == Infinity ? (
			''
		) : (
			<div className="description">
				<h3>{this.camelToNormalCase(reversedSolveMethods[method])}</h3>
				<div>{descriptions[reversedSolveMethods[method]]}</div>
			</div>
		)
	}
}
