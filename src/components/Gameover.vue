<template>
<section id="gameover">
	<h2>If you want success, the foremost thing is to ensure </br>that you are not obstacle to it. </br> - Sadhguru</h2>
	<h1>Try Again</h1>
	<p>Press any button to replay</p>
</section>
</template>


<script>
export default {
	name: 'Gameover',
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

	background-color: rgba(0, 0, 0, .8);

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

h2 {
	margin-top: auto;
	font-size: 1em;
	margin-bottom: 15px;
}

h1 {
	margin-bottom: auto;
	font-size: 3.45em;
	line-height: 1;
	text-shadow: 0 .1em 0 hsla(241, 86%, 40%, 0.596);

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
