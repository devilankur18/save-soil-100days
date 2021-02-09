
import store from '@/store'

class Key {
	constructor() {
		this.keyMap = {
			// 38: [() => {}, ...],
		}

		// controls
		window.addEventListener('keydown', ({ keyCode }) => {

			if (store.state.globalSpeed === 0) return
			if (store.state.achievement) return

			if (this.keyMap[keyCode]) {
				this.keyMap[keyCode].map(fn => fn())
			}
		})
	}

	on(cbs = {}) {
		Object.keys(cbs).map(keyCode => {
			this.keyMap[keyCode]
				? this.keyMap[keyCode].push(cbs[keyCode])
				: this.keyMap[keyCode] = [ cbs[keyCode] ]
		})
	}

	off() {
		this.keyMap = {}
	}
}

const key = new Key()

export default key
