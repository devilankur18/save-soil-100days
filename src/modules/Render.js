import { 
	Application,
	// Rectangle,
	// Sprite,
	// Texture,
	utils,
	// settings,
	// SCALE_MODES,
	// WRAP_MODES,
	// filters as builtInFilters,
} from 'pixi.js'

// import * as filters from 'pixi-filters'

import { Tween } from 'es6-tween'

import { url, loader } from '@/assets/tiles'

import animator from '@/utils/animator'
import debounce from '@/utils/debounce'
import shuffle from '@/utils/shuffle'

import Background from '@/modules/Background'
import Way from '@/modules/Way'

import store from '@/store'
import audio from '@/modules/audio'

import { WIDTH, HEIGHT, isMobile } from '@/config'

export default class Render {
	constructor({ afterLoad }) {

		this.afterLoad = afterLoad

		utils.skipHello()

		// keep this only for pixel art / low res sprites
		// settings.SCALE_MODE = SCALE_MODES.NEAREST
	
		this.scene = new Application({
			width: WIDTH,
			height: HEIGHT,
			antialias: false,
			transparent: false,
			autoResize: false,
			backgroundColor: 0x140820,
			powerPreference: 'high-performance',
		})

		this.loader = loader

		this.init()
	}

	preload() {
		return new Promise(resolve => {
	
			let resources = {}
			Object.keys(url).map(key => {
				if (!this.loader.resources[url[key]]) resources[key] = url[key]
			})
	
			// console.log(resources)
	
			// load assets
			this.loader
				.add(Object.values(resources))
				// .use((res, next) => {
				// 	res.onComplete.add(r => {
				// 		if (r.extension === 'json') {
				// 			r.data.meta.image = require('../assets/tiles/player/' + r.data.meta.image)
				// 		}
				// 	})
				// 	next()
				// })
				.load(resolve)
	
			// temp
			// let loaded = 0
			// this.loader.onLoad.add(() => {
			// 	console.log(`loading: ${~~(100 * loaded++ / Object.keys(resources).length)}%`)
			// })
		})
	}

	async init() {
		await this.preload()

		this.afterLoad()

		window.addEventListener('resize', debounce(() => this.resize(), isMobile ? 200 : 500))

		// main animation loop
		this.tweens = []

		this.createLayers()

		// set position of layers
		this.setSize()
		this.resize()


		// intro stuff
		;['way', 'near', 'middle', 'far', 'bgNear', 'bgFar', 'clouds'].map(name => {
			let initPosY = this.layers[name].container.position.y + HEIGHT / 1.5

			this.layers[name].initPosY = initPosY
			this.layers[name].container.position.y = initPosY
		})

		// 
		animator.add((delta) => this.update(delta))

		// pixi update loop
		this.scene.ticker.add(delta => animator.play(delta))


		this.start()

		this.afterLoad()
	}

	createLayers() {
		this.layers = {
			// sky: 	new Background({ name: 'sky', pivotY: 1, repeat: false }),
			sun: 	new Background({ name: 'sun', pivotX: .5, repeat: false}),
			planet: new Background({ name: 'planet', repeat: false}),

			clouds: new Background({ name: 'clouds', speed: -.8, speedModifier: -.1}),

			bgFar: 	new Background({ name: 'bg-far', pivotY: 1, speed: -.05}),
			bgNear: new Background({ name: 'bg-near', pivotY: 1, speed: -.1}),

			far: 	new Background({ name: 'far', pivotY: 1, speed: -.15}),
			middle: new Background({ name: 'middle', count: 2, pivotY: 1, speed: -.25}),
			near: 	new Background({ name: 'near', count: 4, pivotY: 1, speed: -.55}),

			way: 	new Way(),
		}

		// let displacementSprite = new Sprite(loader.resources[ url['noise'] ].texture)
		// displacementSprite.texture.baseTexture.wrapMode = WRAP_MODES.REPEAT

		// console.log(filters)

		// let displacementFilter = new builtInFilters.DisplacementFilter(displacementSprite)
		// // displacementFilter.filterArea = new Rectangle(0, 0, this.layers.near.container.width / 2, this.layers.near.container.height / 8)

		// displacementSprite.scale.y = .6
		// displacementSprite.scale.x = .6

		// this.layers.near.container.filters = [
		// 	new filters.ReflectionFilter(),
		// 	displacementFilter,
		// ]

		// this.tweens.push(
		// 	new Tween({ time: 0 })
		// 		.to({ time: 10 }, 6500)
		// 		.on('update', ({ time }) => this.layers.near.container.filters[0].time += .025)
		// 		.repeat(Infinity)
		// 		.start(),
		// )


		this.introTween = new Tween({ offset: 0, n: 0 })
			.to({ offset: -HEIGHT / 1.5, n: 1 }, 500)
			.on('update', ({ offset, n }) => {

				;['way', 'near', 'middle', 'far', 'bgNear', 'bgFar', 'clouds'].map(name => {
					this.layers[name].container.position.y = this.layers[name].initPosY + offset
				})
			})
			.on('complete', () => setTimeout(() => this.makeBoom(), 500))
			.delay(500)


		this.scene.stage.addChild(
			...Object.values(this.layers).map(layer => layer.container),
		)
	}

	makeBoom() {
		this.layers['way'].start({
			callback: () => {
				store.commit('setGlobalSpeed', 1.5)
				audio.start('background', true)
			}
		})
	}

	setSize() {

		this.layers.way.container.position.y = HEIGHT

		this.layers.near.container.position.y = HEIGHT - this.layers.way.container.height / 4

		let bottomOffset = this.layers.near.container.position.y - this.layers.way.container.height / 2

		this.layers.middle.container.position.y = bottomOffset
		this.layers.far.container.position.y = bottomOffset

		this.layers.bgNear.container.position.y = bottomOffset
		this.layers.bgFar.container.position.y = bottomOffset

		// this.layers.sky.container.position.y = H
		// this.layers.sky.container.children[0].scale.x = this.scene.renderer.width / this.layers.sky.container.children[0].width

		this.layers.sun.container.position.x = WIDTH / 2
		this.layers.planet.container.position.x = HEIGHT * .75
	}

	resize() {
		let W = window.innerWidth
		let H = window.innerHeight

		this.scene.renderer.resize(W, H)

		W / H >= WIDTH / HEIGHT
			? this.scene.stage.scale.x = this.scene.stage.scale.y = this.scene.renderer.width / WIDTH
			: this.scene.stage.scale.x = this.scene.stage.scale.y = this.scene.renderer.height / HEIGHT

		this.scene.stage.y = H - (HEIGHT * this.scene.stage.scale.x) // black magic

		this.layers.sun.container.position.x = WIDTH / 2
		this.layers.planet.container.position.x = WIDTH * .75

		// console.warn('scene resize')
	}

	start() {
		this.scene.start()
		audio.set('cutoff')

		this.started = true
	}

	stop() {
		this.scene.stop()
		audio.set('cutoff', 450)

		this.started = false
	}

	run() {
		this.introTween.start()
	}

	restart() {
		this.scene.stage.removeChild(this.layers.way.container)

		this.layers.way = new Way()

		this.scene.stage.addChild(this.layers.way.container)

		this.setSize()
		this.resize()
		this.start()

		setTimeout(() => this.makeBoom(), 500)
	}

	update(delta) {

		Object.values(this.layers).map(c => {
			c.update(delta * store.state.globalSpeed, delta, store.state.globalSpeed)
		})

		this.introTween.update()

		this.tweens.map(tween => tween.update())
	}
}
