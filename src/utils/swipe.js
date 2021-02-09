
export default class Swipe {
	constructor() {

		this.touchstartX = 0
		this.touchstartY = 0
		this.touchendX = 0
		this.touchendY = 0

		this.limit = Math.tan(45 * 1.5 / 180 * Math.PI)

		let container = document.getElementById('scene')

		this.threshold = Math.max(1, Math.floor(0.01 * (window.innerWidth || document.body.clientWidth)))
		
		container.addEventListener('touchstart', e => {
			this.touchstartX = e.changedTouches[0].screenX
			this.touchstartY = e.changedTouches[0].screenY
		}, false)

		container.addEventListener('touchend', e => {
			this.touchendX = e.changedTouches[0].screenX
			this.touchendY = e.changedTouches[0].screenY
			
			this.handleTouch(e)

		}, false)
	}

	on({ up, down }) {
		this.up = up
		this.down = down
		// this.left = left
		// this.right = right
	}

	handleTouch(e) {
		let x = this.touchendX - this.touchstartX
		let y = this.touchendY - this.touchstartY

		let xy = Math.abs(x / y)
		let yx = Math.abs(y / x)

		if (Math.abs(x) > this.threshold || Math.abs(y) > this.threshold) {
			// if (yx <= this.limit) {
			// 	if (x < 0) this.left()
			// 	else this.right()
			// }
			if (xy <= this.limit) {
				if (y < 0) this.up()
				else this.down()
			}
		}
	}
}


// export default swipe
