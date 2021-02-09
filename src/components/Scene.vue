<template>
<div id="scene" :class="{ loaded, gameover }"/>
</template>


<script>
import { mapState } from 'vuex'
import Render from '@/modules/Render'

export default {
	name: 'Scene',
	data: () => ({
		loaded: false,
	}),
	mounted() {
		this.render = new Render({
			afterLoad: () => {
				this.loaded = true
				this.$emit('loaded')
			},
		})

		this.render.globalSpeed = this.globalSpeed

		this.$el.appendChild(this.render.scene.view)
	},
	methods: {
		run() {
			this.render.run()
		},
		stop() {
			this.render.stop()
		},
		start() {
			this.render.start()
		},
		restart() {
			this.render.restart()
		},
	},
	computed: {
		...mapState({
			globalSpeed: state => state.globalSpeed,
			gameover: state => state.gameover,
		}),
	},
	watch: {
		globalSpeed(speed) {
			this.render.globalSpeed = speed
		},
	},
}
</script>


<style lang="postcss">

#scene {
	opacity: 0;
	transition: opacity .6s;

	&.loaded {
		opacity: 1;
	}

	&.gameover {
		pointer-events: none;
	}
}

canvas {
	width: 100%;
}

</style>
