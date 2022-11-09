<template>
<section id="gameover">
	<div class="reason-container">
		<div v-if="gameOverReason == 'hp'">
			<img class="reason" src="@/assets/images/hp-4.png">
			<h2  v-if="gameOverReason == 'hp'">Life Empty </h2>
			<h3 >Avoid Crashing in to objects</h3>
		</div>
		<div v-if="gameOverReason == 'gas'">
			<img class="reason" src="@/assets/images/gas-4.png">
			<h2 v-if="gameOverReason == 'gas'" >Fuel Empty </h2>
			<h3 >Keep collecting fuel</h3>
		</div>
	</div>

	<h1 class="score-container">
		Score {{score}}
	</h1>

	

	<h2>If you want success, the foremost thing is to ensure </br>that you are not obstacle to it. </br> - Sadhguru</h2>
	<h1>Try Again</h1>
	<p>Press any button to replay</p>
</section>
</template>


<script>
import { mapState } from 'vuex'	
export default {
	name: 'Gameover',
	computed: {
		...mapState({
			gameOverReason: state => state.gameOverReason,
			score: state => state.score,
		}),
	},
}
</script>


<style lang="postcss" scoped>

#gameover {
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

	background-color: rgba(0, 0, 0, 0.8);

	text-align: center;
	font-size: 16px;

	user-select: none;
	pointer-events: none;
	z-index: 99;

	opacity: 0;
	transition: opacity .4s;

	&.visible {
		opacity: 1;
	}

	@media (min-width: 960px) {
		font-size: 24px;
	}
}

.reason-container {
	margin-top: auto;
}
.score-container {
	margin-top: auto;
}
.reason {
	
	animation: blink .400s infinite linear alternate;
	opacity: 0;
}

h3 {
	font-size: 0.8em;
}


h2 {
	margin-top: auto;
	font-size: 1em;
	margin-bottom: 15px;
}

h1 {
	margin-bottom: auto;
	font-size: 3.45em;
	line-height: 1;
	text-shadow: 0 .1em 0 #72b73b;

	@media (min-width: 960px) {
		font-size: 4.75em;
	}
}

p {
	margin-bottom: 10%;
	font-family: '712';
	font-size: 1.5em;
	opacity: 0;
	animation: blink .65s infinite linear alternate;
}

</style>
