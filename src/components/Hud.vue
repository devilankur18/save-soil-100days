<template>
<div id="hud">
	<section class="hp" :class="{ extended: hp.max > 4 }">
		<img v-if="hp.max <= 4" src="@/assets/images/hp-4.png">
		<img v-else src="@/assets/images/hp-10.png">
		<ul>
			<li v-for="i in hp.current" :key="i"/>
		</ul>
	</section>
	<section class="gas" :class="{ extended: gas.max > 4 }">
		<img v-if="gas.max <= 4" src="@/assets/images/gas-4.png">
		<img v-else src="@/assets/images/gas-10.png">
		<ul>
			<li v-for="i in gas.current" :key="i"/>
		</ul>
	</section>
</div>
</template>


<script>
import { mapState } from 'vuex'

export default {
	name: 'Hud',
	computed: {
		...mapState({
			hp: state => state.hp,
			gas: state => state.gas,
		}),
	},
}
</script>


<style lang="postcss" scoped>

#hud {
	position: absolute;
	top: 20px;
	left: 20px;
	font-size: 0;
	opacity: 0;
	transition: opacity .4s;
	pointer-events: none;
	z-index: 99;

	&.visible {
		opacity: 1;
	}

	/* @media (min-width: 960px) {
		top: 40px;
		left: 40px;
	} */
}

@keyframes fade-in {
	to {
		opacity: 1;
	}
}

section {
	position: relative;
	margin-bottom: 16px;

	&.extended {
		margin-left: -3px;

		& ul {
			top: 12px;
			left: 42px;
		}
	}
}

.hp.extended {
	margin-top: -3px;
	margin-bottom: 13px;
}

.hp li {
	background-color: #A0EE45;
}

.gas.extended {
	margin-top: -3px;
}

.gas li {
	background-color: #008AFF;
}

.gas ul {
	padding-top: 6px;
}

ul {
	position: absolute;
	top: 9px;
	left: 39px;

	display: flex;
	align-items: center;
}

li {
	width: 6px;
	height: 15px;
	margin-right: 3px;
}

</style>
