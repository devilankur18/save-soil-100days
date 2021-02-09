import { Container, Sprite, AnimatedSprite } from 'pixi.js'

import Background from '@/modules/Background'
import Player from '@/modules/Player'
import Item from '@/modules/Item'

import random from '@/utils/random'
import shuffle from '@/utils/shuffle'
import clamp from '@/utils/clamp'

import store from '@/store'
import audio from '@/modules/audio'

import pad from '@/utils/pad'
import debounce from '@/utils/debounce'

import { url, loader } from '@/assets/tiles'
import { time, WIDTH, HEIGHT, maxSpeed, portrait } from '@/config'

export default class Way {
	constructor() {

		this.maxSpeed = maxSpeed

		this.container = new Container()


		this.obstacles = []

		this.now = 0

		this.spawn = {
			timer: this.now,
			interval: time.items,
		}
		window.addEventListener(
			'resize',
			debounce(() => this.spawn.interval = time.items, 200)
		)

		this.gasLoss = {
			timer: this.now,
			interval: time.gas,
		}

		this.checkpointAppear = {
			timer: this.now,
			interval: time.checkpoint,
		}

		this.scoring = {
			timer: this.now,
			interval: time.score,
		}

		this.checkpoints = {
			'start-checkpoint': () => {

			},
			'gas-checkpoint': () => {
				store.commit('maximize', { name: 'gas' })
				this.player.setSkin(1)

				store.commit('setScore', 1000)
				this.scoring.timer = 0

				audio.start('achievement')
			},
			'hp-checkpoint': () => {
				store.commit('maximize', { name: 'hp' })
				this.player.setSkin(2)

				store.commit('setScore', 1000)
				this.scoring.timer = 0

				audio.start('achievement')
			},
			'final-checkpoint': () => {
				store.commit('setScore', 1000)
				store.commit('setFinal')
				this.maxSpeed = 100
			},
		}

		this.items = []

		this.typeChances = ['obstacle', 'bonus']

		this.itemChances = {
			bonus: [ 'card' ],
			obstacle: ['acid', 'pit', 'barrier'],
		}

		this.safeArea = {
			'acid':		0.35,
			'pit': 		0.25,
			'barrier': 	0,
			'card': 	0,
			'gas': 		0,
		}


		this.createRoad()

		this.createPlayer()

		this.createCheckpoint({
			name: 'start-checkpoint',
			posX: this.player.container.position.x,
			cross: this.checkpoints['start-checkpoint'],
		})
	}

	start({ callback }) {
		let frames = []

		for (let i = 1; i < 12; i++) {
			let sprite = new Sprite(loader.resources[ url[`boom-${pad(i)}`] ].texture)
			frames.push(sprite.texture)
		}

		let animation = new AnimatedSprite(frames)
		animation.animationSpeed = .2
		animation.loop = false

		// setTimeout(() => {
		// 	callback()
		// 	this.player.say()
		// }, 50)

		animation.position.x = this.checkpoint.container.width / 2
		this.checkpoint.container.addChild(animation)

		animation.play()
		audio.start('boom')

		this.player.say()
		callback()
	}

	createRoad() {
		this.road = new Background({
			name: 'road',
			count: 3,
			pivotY: 1,
			speed: -15,
			repeatSprite: 1,
			sprites: [1, 1, 1],
		})
		this.road.sprites = shuffle([1, 1, 1, 2, 3]) // 1st sprite has more chances to appear

		this.container.addChild(this.road.container)
	}

	createPlayer() {
		this.player = new Player({ audio: audio })

		this.player.container.position.x = portrait
			? this.player.container.width / 2
			: WIDTH / 4

		this.player.container.position.y = -180
		this.player.container.zIndex = 1

		this.player.invincible = false

		this.container.addChild(this.player.container)
	}

	createItem(options = {}) {

		let type = random.from(this.typeChances)
		let name = random.from(this.itemChances[type])

		let cross = () => {
			if (this.player.invincible) return

			this.player.bump(item.name)

			store.commit('set', { name: 'hp', value: -1 })

			if (store.state.hp.current) audio.start('hit')
			else audio.start('gameover')

			store.commit('setGlobalSpeed', 1)
		}

		let route
		if (type === 'bonus') { // card appeared
			this.itemChances.bonus = store.state.hud
				? [ 'gas' ]
				: [ 'gas', 'card', 'gas', 'gas' ]

			this.typeChances = ['obstacle', 'obstacle', 'bonus', 'obstacle']

			if (name === 'card') route = 1

			cross = function(callback) {
				store.commit('showHud')
				store.commit('setScore', 500)

				this.container.alpha = 0

				if (callback) callback()
			}
		}

		if (name === 'gas') {
			this.typeChances = [ 'obstacle' ]

			cross = function(callback) {
				store.commit('set', { name: 'gas', value: 10 })
				store.commit('setScore', 100)

				this.container.alpha = 0

				if (callback) callback()
			}
		}

		shuffle(this.typeChances)

		let item = new Item({
			type: 		options.type || type,
			name: 		options.name || name,
			cross: 		options.cross || cross,
			safeArea: 	this.safeArea[ (options.name || name) ],
		})
		// item.route = options.route || 0
		item.route = route || random.from([0, 1, 2])

		item.container.position.x = WIDTH + random.range(0, WIDTH / 8)
		item.container.position.y = -(0.235 * this.container.height + 52 * item.route)

		item.container.zIndex = 0

		this.items.push(item)
		this.container.addChild(item.container)

		this.sort()
	}

	createCheckpoint({ name, posX, cross }) {

		this.checkpoint = new Item({
			name,
			pivotX: .5,
			cross,
		})

		this.checkpoint.container.position.x = posX || WIDTH * 1.5
		this.checkpoint.container.position.y = 0

		this.checkpoint.container.zIndex = 1

		this.container.addChild(this.checkpoint.container)

		this.sort()
	}

	sort() {
		this.container.children.sort((a, b) => a.zIndex - b.zIndex)
	}

	checkItems(now, globalSpeed) {
		if (this.checkpoint.container.parent) return // checkpoint on the road

		if (now - this.spawn.timer >= this.spawn.interval / globalSpeed) {
			this.createItem()
			this.spawn.timer = now
		}
	}

	checkGas(now, globalSpeed) {
		if (now - this.gasLoss.timer >= this.gasLoss.interval / globalSpeed) {

			store.commit('set', { name: 'gas', value: -1 })

			if (store.state.gas.current < random.range(.6 * store.state.gas.max, .8 * store.state.gas.max)) {

				this.typeChances = ['obstacle', 'obstacle', 'bonus', 'obstacle']
			}

			this.gasLoss.timer = now
		}
	}

	checkCheckpoints(now, globalSpeed) {
		if (now - this.checkpointAppear.timer >= this.checkpointAppear.interval / globalSpeed) {

			let next = Object.keys(this.checkpoints)[ Object.keys(this.checkpoints).indexOf(this.checkpoint.name) + 1 ]

			if (!next) return this.checkpointAppear.interval = Infinity


			this.createCheckpoint({
				name: next,
				cross: this.checkpoints[next]
			})
			this.checkpoint.container.position.x += this.checkpoint.container.width / 2

			this.checkpointAppear.timer = now
		}
	}

	checkCollisions(speed) {

		// obstacles and bonuses
		this.items = this.items.filter(item => {

			if (!item.update(speed * this.road.speed)) return false

			if (item.skip) return true
			if (item.route !== this.player.route) return true


			if (item.type === 'bonus') {

				let d = this.player.container.position.x - item.container.position.x

				if ((d > 0) && (d < this.player.container.width + item.container.width)) {

					item.cross(() => audio.start('bonus'))
					item.skip = true
					return true
				}
			}


			if (this.player.container.position.x > item.container.position.x + item.container.width) {
				item.skip = true
				return true
			}

			if ((item.container.position.x + item.safeArea) - this.player.container.position.x < 5) {
				item.cross(() => audio.start('bonus'))
				item.skip = true
			}

			return true
		})

		// checkpoint cross
		if (this.checkpoint.skip) return

		if (this.player.container.position.x > this.checkpoint.container.position.x) {
			this.checkpoint.cross()
			this.checkpoint.skip = true
		}
	}

	checkScoring(now, globalSpeed) {
		if (now - this.scoring.timer >= this.scoring.interval / globalSpeed) {

			store.commit('setScore', 10)

			this.scoring.timer = now
		}
	}

	update(speed, delta, globalSpeed) {

		// update positions
		this.road.update(speed, delta)
		this.player.update(speed)

		if (!store.state.globalSpeed) return


		if (this.checkpoint) this.checkpoint.update(speed * this.road.speed)
		
		if (store.state.phrase) return store.commit('setGlobalSpeed', clamp((globalSpeed - .00085), .5, this.maxSpeed))

		// speed up
		globalSpeed < 1
			? store.commit('setGlobalSpeed', clamp((globalSpeed + .01), 0, this.maxSpeed))
			: store.commit('setGlobalSpeed', clamp((globalSpeed + .0001), 0, this.maxSpeed))


		this.now += delta * 1000 / 60


		this.checkItems(this.now, globalSpeed)

		this.checkCheckpoints(this.now, globalSpeed)

		this.checkGas(this.now, globalSpeed)

		this.checkCollisions(speed)
		
		this.checkScoring(this.now, globalSpeed)
	}
}
