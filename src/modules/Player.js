import { Container, Sprite, AnimatedSprite, Texture } from 'pixi.js'
import { Tween } from 'es6-tween'

import { url, loader } from '@/assets/tiles'

import key from '@/utils/key'
import Swipe from '@/utils/swipe'

import store from '@/store'


export default class Player {
	constructor() {

		this.container = new Container()

		this.speed = .25
		this.route = 1

		this.invincible = false

		this.currentSkin = 0

		this.init()
	}

	init() {

		this.animations = []

		for (let i = 1; i <= 3; i++) {

			let frames = []

			for (let j = 1; j <= 3; j++) {
				let sprite = new Sprite(loader.resources[ url[`bike${i}-${j}`] ].texture)
				frames.push(sprite.texture)
			}

			let animation = new AnimatedSprite(frames)
			animation.animationSpeed = this.speed

			this.animations.push(animation)
		}

		this.animations[this.currentSkin].play()
		this.container.addChild(this.animations[this.currentSkin])

		// helper
		// let bg = new Sprite(Texture.WHITE)
		// bg.width = this.container.width
		// bg.height = this.container.height
		// bg.tint = 0xff0000
		// bg.alpha = .25
		// this.container.addChild(bg)

		this.shadow = new Sprite(loader.resources[ url['shadow'] ].texture)
		this.shadow.anchor.y = 1
		this.shadow.position.y = this.container.height

		this.container.addChild(this.shadow)

		this.container.pivot.x = this.container.width
		this.container.pivot.y = this.container.height


		// start phrase stuff
		let phrase = new Sprite(loader.resources[ url['phrase'] ].texture)
		phrase.pivot.y = phrase.height
		phrase.position.x = this.container.width / 2
		phrase.position.y = 0
		phrase.alpha = 0

		this.container.addChild(phrase)

		this.phraseTween = new Tween({ alpha: 0 })
			.to({ alpha: [1, 1, 1, 1, 1, 0] }, 2500)
			.on('start', () => store.state.phrase = false)
			.on('update', ({ alpha }) => phrase.alpha = alpha)
			.on('complete', () => this.container.removeChild(phrase))
			.delay(500)


		this.bumpTween = this.tween = new Tween({ alpha: 1 })
			.to({ alpha: [0, 1, 0, 1, 0, 1, 0, 1] }, 1000)
			.on('start', () => {
				this.invincible = true

				if (window.navigator.vibrate) {
					window.navigator.vibrate({
						'acid': 500,
						'barrier': 250,
						'pit': [125, 50, 125],
					}[this.tween.obstacle])
				}
			})
			.on('update', ({ alpha }) => this.container.alpha = alpha)
			.on('complete', () => this.invincible = false)


		// controls
		key.off()
		key.on({
			87: () => this.up(), 	// w
			83: () => this.down(), 	// s

			38: () => this.up(),	// arrow up
			40: () => this.down(),	// arrow down
		})

		let swipe = new Swipe()

		swipe.on({
			'up': () => this.up(),
			'down': () => this.down(),
		})

		// this.tween = new Tween({ alpha: 1 })
		// 	.to({ alpha: [0, 1, 0, 1, 0, 1, 0, 1] }, 1000)
		// 	.on('start', () => {
		// 		this.invincible = true

		// 		if (window.navigator.vibrate) {
		// 			window.navigator.vibrate({
		// 				'acid': 500,
		// 				'barrier': 250,
		// 				'pit': [125, 50, 125],
		// 			}[this.tween.obstacle])
		// 		}
		// 	})
		// 	.on('update', ({ alpha }) => this.container.alpha = alpha)
		// 	.on('complete', () => this.invincible = false)
	}

	say() {
		this.phraseTween.start()
	}

	setSkin(n) {
		this.currentSkin = n

		this.animations[n - 1].stop()
		this.animations[n].play()

		this.container.removeChild(this.animations[n - 1])
		this.container.addChildAt(this.animations[n], 0)
	}

	bump(type) {
		if (this.tween.isPlaying()) this.tween.stop()

		this.tween.obstacle = type
		this.bumpTween.start()
	}

	up() {
		this.route !== 2 && this.setRoute(1)
	}

	down() {
		this.route !== 0 && this.setRoute(-1)
	}

	setRoute(d) {
		this.route += d
		this.container.position.y -= d * 54
	}

	// preload() {
	// 	return new Promise(resolve => {
	// 		const data = require('@/assets/tiles/sheets/bike1.json').url

	// 		console.log(data)

	// 		this.loader
	// 			.add(data)
	// 			.load((loader, resources) => {

	// 				const sheet = new Spritesheet(resources['bike1'].texture.baseTexture, data)

	// 				sheet.parse((...args) => {
	// 					console.log('parsed', ...args)
	// 				})

	// 				resolve()
	// 			})
	// 	})
	// }

	update(speed) {
		this.animations[this.currentSkin].animationSpeed = this.speed * speed

		this.phraseTween.update()
		this.bumpTween.update()
	}
}
