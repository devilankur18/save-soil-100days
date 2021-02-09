
export default class VCF {
	constructor(context) {

		this.context = context
		this.filter = this.context.createBiquadFilter()
		this.filter.type = 'lowpass'

		this.filter.frequency.value = 20000

		this.input = this.filter
		this.output = this.filter

		// this.modulated = this.context.createGain()
		// this.modulated.gain.value = 6000 // 6 * 100 cents => -6000..6000 (one octave)

		// this.modulated.connect(this.filter.detune)
	}

	set(name, value) {
		({
			'freq': () => this.filter.frequency.value = value,
			'qual': () => this.filter.Q.value = value,
		})[name]()
	}

	connect(node) {
		if (node.hasOwnProperty('input')) this.output.connect(node.input)
		else this.output.connect(node)
	}
}
