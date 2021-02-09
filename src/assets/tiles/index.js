import { Loader } from 'pixi.js'

import pad from '@/utils/pad'

const url = {
	'road-1': require('./road/1.png'),
	'road-2': require('./road/2.png'),
	'road-3': require('./road/3.png'),

	'water': require('./water.png'),

	'near-1': require('./near/1.png'),
	'near-2': require('./near/2.png'),
	'near-3': require('./near/3.png'),
	'near-4': require('./near/4.png'),

	'middle-1': require('./middle/1.png'),
	'middle-2': require('./middle/2.png'),

	'far': require('./far.png'),

	'bg-near': require('./bg-near.png'),
	'bg-far': require('./bg-far.png'),

	'sky': require('./sky.png'),
    'sun': require('./sun.png'),
	'planet': require('./planet.png'),
	'clouds': require('./clouds.png'),

	'phrase': require('./phrase.png'),

	'bike1-1': require('./sheets/bike1-1.png'),
	'bike1-2': require('./sheets/bike1-2.png'),
	'bike1-3': require('./sheets/bike1-3.png'),

	'bike2-1': require('./sheets/bike2-1.png'),
	'bike2-2': require('./sheets/bike2-2.png'),
	'bike2-3': require('./sheets/bike2-3.png'),

	'bike3-1': require('./sheets/bike3-1.png'),
	'bike3-2': require('./sheets/bike3-2.png'),
	'bike3-3': require('./sheets/bike3-3.png'),

	'shadow': require('./sheets/shadow.png'),

	'acid': require('./obstacles/acid.png'),
	'barrier': require('./obstacles/barrier.png'),
	'pit': require('./obstacles/pit.png'),

	'card': require('./bonuses/card.png'),
	'gas': require('./bonuses/gas.png'),

	'start-checkpoint': require('./checkpoints/start-checkpoint.png'),
	'gas-checkpoint': require('./checkpoints/gas-checkpoint.png'),
	'hp-checkpoint': require('./checkpoints/hp-checkpoint.png'),
	'final-checkpoint': require('./checkpoints/final-checkpoint.png'),

	// 'noise': require('./noise.png'),
}

for (let i = 1; i < 12; i++) {
	let index = pad(i, 2)
	url[`boom-${index}`] = require(`./boom/${index}.png`)
}


let loader = new Loader()

export {
	url,
	loader,
}
