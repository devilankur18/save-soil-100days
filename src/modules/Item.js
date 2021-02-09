import { Container, Sprite, Texture } from 'pixi.js'
import { url, loader } from '@/assets/tiles'

export default class Item {
	constructor({ type, name, pivotX = 0, pivotY = 1, cross, safeArea = 0 }) {

		this.type = type
		this.name = name
		this.cross = cross

		this.container = new Container()

		let sprite = new Sprite(loader.resources[ url[this.name] ].texture)

		this.container.addChild(sprite)

		this.container.pivot.x = this.container.width * pivotX
		this.container.pivot.y = this.container.height * pivotY

		this.safeArea = safeArea * this.container.width

		// helper
		// let bg = new Sprite(Texture.WHITE)
		// bg.width = this.container.width
		// bg.height = this.container.height
		// bg.tint = 0xff0000
		// bg.alpha = .25
		// this.container.addChild(bg)
	}

	update(speed) {
		this.container.position.x += speed

		if (!this.container.parent) return false

		if (this.container.position.x + this.container.width < 0) {
			this.container.parent.removeChild(this.container)
			return false
		}

		return true
	}
}
