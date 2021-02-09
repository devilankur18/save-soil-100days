<template>
<div class="achievement" :class="{ visible }">
	<img :src="imgPath">
	<p>Нажмите любую кнопку, чтобы продолжить</p>
</div>
</template>


<script>
import { mapState } from 'vuex'

export default {
	name: 'Achievement',
	props: {
		name: {
			type: String,
		},
	},
	computed: {
		...mapState({
			achievement: state => state.achievement,
		}),
		imgPath() {
			return require(`@/assets/images/${this.name}-achievement.png`)
		},
		visible() {
			return this.achievement === this.name
		},
	},
}
</script>


<style lang="postcss" scoped>

.achievement {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 20px;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	text-align: center;
	font-size: 16px;

	@media (min-width: 960px) {
		font-size: 24px;
	}

	background-color: rgba(0, 0, 0, .8);
	pointer-events: none;
	opacity: 0;
	transition: all .4s;

	z-index: 98;

	&.visible {
		opacity: 1;
	}
}

img {
	margin: 10vh 0 5vh;
	max-width: 70%;

	@media (orientation: portrait) {
		max-width: 100%;
	}
}

p {
	font-family: '712';
	font-size: 1.5em;
	opacity: 0;
	animation: blink .65s infinite linear alternate;
}

</style>
