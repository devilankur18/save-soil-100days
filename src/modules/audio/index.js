import { AudioContext as StandardizedAudioContext } from 'standardized-audio-context'

import VCF from '@/modules/audio/VCF'
import BufferLoader from '@/modules/audio/BufferLoader'

import { volume } from '@/config'

class Synth {
	constructor() {
		try {
			this.context = window.webkitAudioContext
				? new StandardizedAudioContext()
				: new AudioContext()

			document.body.addEventListener('mousedown', () => this.resumeAudio())
			document.body.addEventListener('keydown', () => this.resumeAudio())
		}
		catch (e) {
			console.log('Web Audio API is not supported in this browser')
			return false
		}

		this.loader = new BufferLoader(this.context)

		this.init()
	}

	async preload(url) {
		this.loaded = await this.loader.load(url)

		return Object.keys(this.loaded).reduce((acc, key) => ({
			...acc,
			[key]: this.createAudio(key)
		}), {})
	}

	createAudio(key) {
		let source = this.context.createBufferSource()
		source.buffer = this.loaded[key]

		if (key === 'background') source.connect(this.VCF.input)
		else source.connect(this.overallGain)

		source.isPlaying = false
		source.onended = () => source.played = true

		return source
	}

	start(name, loop = false) {

		if (this.sounds[name].played) {
			this.stop(name)
			this.sounds[name] = this.createAudio(name)
		}

		this.sounds[name].loop = loop
		this.sounds[name].start(0)
		this.sounds[name].played = true
	}

	stop(name) {
		this.sounds[name].stop(0)
	}

	set(name, value) {
		({
			'gain': () => this.overallGain.gain.value = value,
			'cutoff': () => this.VCF.set('freq', value || 20000)
		})[name]()
	}

	async init() {

		this.VCF = new VCF(this.context)

		this.overallGain = this.context.createGain()
		this.overallGain.gain.value = volume

		this.sounds = await this.preload({
			'background': require('@/assets/audio/background.mp3'),
			'bonus': require('@/assets/audio/bonus.mp3'),
			'boom': require('@/assets/audio/boom.mp3'),
			// 'turn': require('@/assets/audio/turn.mp3'),
			'gameover': require('@/assets/audio/gameover.mp3'),
			'hit': require('@/assets/audio/hit.mp3'),
			'achievement': require('@/assets/audio/achievement.mp3'),
		})

		// connections
		this.VCF.connect(this.overallGain)
		this.overallGain.connect(this.context.destination)
	}

	resumeAudio() {
		if (this.context.state !== 'suspended') return
	
		this.context.resume().then(() => {
			console.log('Playback resumed successfully')
		})
	}

	on() {
		this.overallGain.gain.value = volume
	}

	off() {
		this.overallGain.gain.value = 0
	}
}

let audio = new Synth()

export default audio
