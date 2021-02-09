
let pad = (n, width = 2, z = 0) => {

	n = n + ''

	return n.length >= width
		? n
		: new Array(width - n.length + 1).join(z) + n
}

export default pad
