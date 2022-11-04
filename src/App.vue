<template>
<main id="app">
	<div v-if="!loaded" class="spinner">
		<img src="@/assets/images/bike.gif">
	</div>

	<header :class="{ visible: !ui }">
		<a href="https://rocketbank.ru/" target="_blank">
			<img src="@/assets/images/logo.svg">
		</a>
		<img src="@/assets/images/games.png">
	</header>

	<scene @loaded="loaded = true" ref="scene"/>

	<intro :class="{ visible: step === 0 }"/>

	<hud :class="{ visible: ui && !phrase }"/>

	<gameover :class="{ visible: step === 2 }"/>

	<achievement name="gas"/>
	<achievement name="hp"/>

	<div class="audio" :class="{ visible: ui }" @click.stop="toggleAudio">
		<img v-if="audio" src="@/assets/images/audio-on.png">
		<img v-else src="@/assets/images/audio-off.png">
	</div>

	<div class="score" :class="{ visible: ui && !phrase }">{{ score }}</div>
</main>
</template>


<script>
import { mapState } from 'vuex'

import Intro from '@/components/Intro'
import Scene from '@/components/Scene'
import Hud from '@/components/Hud'
import Gameover from '@/components/Gameover'
import Achievement from '@/components/Achievement'

import audio from '@/modules/audio'

import pad from '@/utils/pad'


export default {
	name: 'App',
	components: {
		Intro,
		Scene,
		Hud,
		Gameover,
		Achievement,
	},
	data: () => ({
		loaded: false,
		audio: true,
	}),
	created() {
		localStorage.getItem('audio') !== null && (this.audio = +localStorage.getItem('audio'))
		!this.audio && audio.off()
	},
	mounted() {
		window.addEventListener('keypress', this.next)
		document.body.addEventListener('click', this.next)
		document.body.addEventListener('touchstart', this.next)
	},
	methods: {
		next() {
			if (!this.loaded) return
			// if (!this.landscape) return

			if (this.achievement) {							// achievement skip
				this.$store.commit('setAchievement', null)
				this.$refs['scene'].start()
			}

			console.log("crashing!!!!")
			if (this.step === 3)
			return
									// final

			if (this.step === 0) {							// intro
				this.$refs['scene'].run()
			}

			if (this.step === 2) this.restart()				// gameover

			this.$store.commit('setStep', 1)
		},
		
		restart() {
			this.$refs['scene'].restart()
			this.$store.commit('restart')
		},

		toggleAudio() {
			this.audio
				? audio.off()
				: audio.on()

			this.audio = !this.audio

			localStorage.setItem('audio', +this.audio)
		},
	},
	computed: {
		...mapState({
			step: state => state.step,
			phrase: state => state.phrase,
			gameover: state => state.gameover,
			achievement: state => state.achievement,
			score: state => pad(state.score, 6),
		}),

		ui() {
			return this.step && this.step < 3
		},
	},
	watch: {
		step(step) {
			if (step === 3) {
				this.$refs['scene'].stop()
				audio.off()
				document.body.classList.add('on-final')
				document.body.style.minHeight = `${window.innerHeight}px`
			}
		},
		achievement(name) {
			if (name) {
				this.$refs['scene'].stop()
				audio.set('cutoff', 450)
			}
		},
		gameover(gameover) {
			if (gameover) {
				this.$refs['scene'].stop()
				this.$store.commit('setStep', 2)
			}
		},
	},
}
</script>


<style lang="postcss">
@import './styles/reset.css';
@import './styles/fonts.css';
@import './styles/transitions.css';

body {
	font-family: 'Hardpixel', sans-serif;
	color: #FFF;
	overflow: hidden;

	&.instagram {
		transform: rotate(-90deg);
	}

	&.on-final {
		background-image: url('./assets/images/final-bg.jpg');
		background-size: cover;
		background-position: right bottom;
		background-attachment: fixed;

		overflow: auto;

		@media (min-width: 960px) {
			background-position: left bottom;
		}

		& header {
			position: relative;
			margin-bottom: 50px;
			transition: 0s;

			@media (min-width: 960px) {
				margin-bottom: 0;
			}
		}
	}
}

.spinner {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #140820;

	display: flex;
	align-items: center;
	justify-content: center;
	
	font-size: 0;
	pointer-events: none;
	z-index: 9002;

	& img {
		max-width: 100%;
	}
}

header {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;

	display: flex;
	align-items: flex-start;
	justify-content: space-between;

	padding: 20px;
	pointer-events: none;

	font-size: 0;
	opacity: 0;
	transform: translate3d(0, -66vh, 0);
	transition: transform .5s .5s, opacity .2s 1s;

	z-index: 100;

	&.visible {
		opacity: 1;
		transform: translate3d(0, 0, 0);
		transition-delay: 0;
	}

	& img {
		width: 120px;

		@media (min-width: 960px) {
			width: 150px;
		}
	}
}

.audio {
	position: fixed;
	font-size: 0;
	cursor: pointer;
	user-select: none;
	z-index: 99;

	opacity: 0;
	transition: opacity .4s;

	@media (max-width: 959px) {
		top: 20px;
		right: 20px;
	}

	@media (min-width: 960px) {
		left: 20px;
		bottom: 20px;
	}

	&.visible {
		opacity: 1;
		transition-delay: .5s;
	}

	& img {
		max-height: 30px;

		@media (min-width: 960px) {
			max-height: 40px;
		}
	}
}

.score {
	position: fixed;
	width: 100px;
	right: 20px;
	bottom: 20px;
	font-size: 1.75em;
	line-height: 1;
	text-shadow: 0 .1em 0 #72b73b;
	pointer-events: none;
	z-index: 99;

	@media (min-width: 960px) {
		width: 140px;
		right: 20px;
		font-size: 2.5em;
	}

	opacity: 0;
	transition: opacity .4s;

	&.visible {
		opacity: 1;
	}
}

@keyframes blink {
	to {
		opacity: 1;
	}
}

@keyframes fade-in {
	to {
		opacity: 1;
	}
}

</style>
