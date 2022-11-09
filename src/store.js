import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import clamp from '@/utils/clamp'

export default new Vuex.Store({
	state: {
		step: 0,

		phrase: true,

		hp: {
			current: 4,
			max: 4,
		},

		gas: {
			current: 4,
			max: 4,
		},

		hud: false,
		achievement: null,

		globalSpeed: 0,
		gameover: false,
		gameOverReason: null,

		score: 0,
		final: false,
	},
	mutations: {
		setStep(state, value) {
			// console.log(`changing step ${state.step} to ${value}`)
			state.step = value
		},

		set(state, { name, value = -1 }) {
			// console.log(name, value, clamp(state[name].current + value, 0, 10))
			state[name].current = clamp(state[name].current + value, 0, state[name].max)

			// 	if (!state[name].current && state.final) return state.step = 3
			if (!state[name].current) {
				state.gameOverReason = name
				state.gameover = true
			}
		},

		maximize(state, { name, value = 10 }) {
			state[name].max = value
			state[name].current = state[name].max

			state.achievement = name
		},

		setAchievement(state, name) {
			state.achievement = name
		},

		showHud(state) {
			state.hud = true
		},

		setGlobalSpeed(state, value) { 
			// state.globalSpeed = clamp(state.globalSpeed + value, 0, 100)
			console.log(`speed ${state.globalSpeed} to ${value}` )
			state.globalSpeed = value
		},

		incrementGlobalSpeed(state, value) { 
			// state.globalSpeed = clamp(state.globalSpeed + value, 0, 100)
			// state.globalSpeed < 0.8
			// 	? state.globalSpeed = parseFloat(process.env.VUE_APP_BASE_SPEED)
			// 	: state.globalSpeed = state.globalSpeed + value
			if (state.globalSpeed < 0.8) {
				state.globalSpeed = parseFloat(process.env.VUE_APP_BASE_SPEED)
			} else if (state.globalSpeed >= 0.8 && state.globalSpeed < 1) {
				state.globalSpeed = 0.8
			} else if (state.globalSpeed >= 1 && state.globalSpeed < 1.3) {
				state.globalSpeed = 1
			} else if (state.globalSpeed >= 1.3) {
				state.globalSpeed = state.globalSpeed - 0.1
			}

				// ? setGlobalSpeed(state, parseFloat(process.env.VUE_APP_BASE_SPEED))
				// : setGlobalSpeed(state, state.globalSpeed + value)
		},

		setScore(state, score) {
			state.score += score
		},

		restart(state) {
			state.hud = false

			state.hp.current = 4
			state.hp.max = 4

			state.gas.current = 4
			state.gas.max = 4

			state.globalSpeed = 0
			state.gameover = false

			state.phrase = true
			state.score = 0
		},

		setFinal(state) {
			state.final = true
		},
	},
	strict: false,
})
