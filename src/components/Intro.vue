<template>
<section id="intro">
	<img src="@/assets/images/intro.png">
	<p style="color: black;">Press any button to &nbsp;start</p>
	<span style="color: black;">100 day Motercyle Journey from UK to India, 30,000 KM </span>
</section>
</template>


<script>
export default {
	name: 'Intro',
}
</script>


<style lang="postcss" scoped>

#intro {
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
	font-family: '712';
	font-size: 16px;

	user-select: none;
	pointer-events: none;
	z-index: 99;


	@media (min-width: 960px) {
		font-size: 24px;
	}

	opacity: 0;
	transform: translate3d(0, -66vh, 0);
	transition: transform .5s .5s, opacity .2s 1s;
	transition-timing-function: linear;

	& p,
	& span {
		opacity: 0;
		transition: opacity .5s;
	}

	&.visible {
		opacity: 1;
		transform: translate3d(0, 0, 0);

		& span {
			opacity: 1;
		}

		& p {
			animation: blink .75s infinite linear alternate;
		}
	}

}

img {
	margin-top: auto;
	max-width: 50vw;

	@media (min-width: 960px) {
		max-width: 900px;
	}

	@media (orientation: portrait) {
		max-width: 100%;
	}
}

p {
	font-family: '712';
	font-size: 1.5em;
	opacity: 0;
}

span {
	margin-top: auto;
	margin-bottom: 0;
	font-size: 1em;

	@media (min-width: 960px) {
		margin-bottom: 20px;
	}
}

</style>
