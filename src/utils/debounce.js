
let debounce = (func, wait, immediate) => {
	let timeout

	return function() {

		let later = () => {
			timeout = null
			if (!immediate) func.apply(this, arguments)
		}

		let callNow = immediate && !timeout

		clearTimeout(timeout)

		timeout = setTimeout(later, wait)

		if (callNow) func.apply(context, args)
	}
}

export default debounce
