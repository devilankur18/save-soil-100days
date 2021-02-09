
class Animator {
	els = []

	add = f => {
		this.els.push(f)
		if (process.env.NODE_ENV === 'development') console.log('animator:', this.els)
	}

	remove = f => {
		this.els = this.els.filter(el => el !== f)
	}

	play = delta => this.els.map(el => el(delta))
}

let animator = new Animator()

export default animator
