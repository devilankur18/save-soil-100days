import { Sprite, Container } from 'pixi.js'
import { url, loader } from '@/assets/tiles'

import shuffle from '@/utils/shuffle'
import random from '@/utils/random'

import { WIDTH, HEIGHT } from '@/config'

class Background {
	constructor({
		name,
		count = 1,
		pivotX = 0,
		pivotY = 0,
		speed = 0,
		speedModifier = 0,
		repeat = true,
		repeatSprite = 0,
		sprites,
	}) {

		this.name = name
		this.count = count
		this.speed = speed
		this.speedModifier = speedModifier
		this.repeat = repeat
		this.repeatSprite = repeatSprite

		this.container = new Container()
		// this.container.alpha = .5

		this.sprites = sprites || []

		if (!this.sprites.length) {

			for (let i = 1; i <= this.count; i++) {
				this.sprites.push(i)
			}
		}
		shuffle(this.sprites)

		this.prevIndex = this.sprites[this.sprites.length - 1]

		this.sprites.reduce((offset, i) => {

			let sprite = this.createSprite(i)
			sprite.position.x = offset

			this.container.addChild(sprite)

			return offset += sprite.width
		}, 0)
	

		this.container.pivot.x = (pivotX || 0) * this.container.width
		this.container.pivot.y = (pivotY || 0) * this.container.height

		this.offset = 0 // after removing offscreen sprite
	}

	createSprite(n) {
		return new Sprite(loader.resources[ url[(this.count > 1) ? `${this.name}-${n}` : this.name] ].texture)
	}

	update(speed, delta) {

		// move layer
		this.container.position.x += (this.speed * speed) + (this.speedModifier * delta)


		if (!this.repeat) return

		// remove offscreen sprite
		if (Math.sign(this.speed) * this.container.position.x > this.container.children[0].width + this.offset) {

			this.offset += this.container.children[0].width

			this.container.removeChildAt(0)
		}

		// add next sprite
		if (this.container.width + this.container.position.x + this.offset < WIDTH) { 

			this.prevIndex = this.prevIndex === this.repeatSprite
				? random.from(this.sprites)
				: random.from(this.sprites.filter(i => i !== this.prevIndex))

			// if (this.name === 'road') console.log(this.container.children.length)

			let sprite = this.createSprite(this.prevIndex)
			sprite.position.x = this.container.width + this.offset

			this.container.addChild(sprite)

			// console.log(`${this.name}: add`, this.container.children)
		}
	}
}

export default Background
