const artist1 = {
	name: 'Jérôme Bareille',
	address: '0xc48757e7f2166e74DeD006a3EC43a2e44A9f3Aac',
	title: 'IZIDESIGN',
	awards: 'Adobe Certified Expert<br/>10th Dan Photoshop & Illustrator ExpressKeys',
	image: '/images/artists/artist1.png',
	nationality: 'French',
	category: 'heavy weight',
	social: 'https://www.instagram.com/izidesign.art',
};

const artist2 = {
	name: 'Popeye',
	address: '0xbd9f8735980ca642d9a6df8899bb1430c32ebf67',
	title: 'jpeg Killer',
	awards: 'Scissors Hands 2022<br/>The Biggest arm in the Metaverse',
	image: '/images/artists/artist2.png',
	nationality: 'French',
	category: 'feather weight',
	social: 'https://twitter.com/PopeyePuzzle',
};

const artist3 = {
	name: 'Alexandre Beretta',
	address: '0x098cfb8a80c9cf7d261b207cb8cb126194c4a8ca',
	title: 'Arthlete',
	awards:
		'9th position World Extreme Roller Championship 2018<br/>5th position International Graffiti Competition 2018 in Latvia',
	image: '/images/artists/artist3.png',
	nationality: 'French',
	category: 'feather weight',
	social: 'https://twitter.com/alex__beretta',
};

const artist4 = {
	name: 'Skio',
	address: '0x81B11a2042a83F8747F5701c5D4C40DD95e33141',
	title: 'Pixel Killer',
	awards: 'Graffiti king 2022<br/>Color philosopher',
	image: '/images/artists/artist4.png',
	nationality: 'French',
	category: 'heavy weight',
	social: 'https://twitter.com/Skio1',
};

export default {
	1: {
		title: 'Battle 1 - NFC Lisbon',
		artists: [artist4, artist3],
		startsAt: 1649068200000,
		duration: 60 * 60 * 1000,
		// startsAt: 1648980943000,
		// duration: 20 * 60 * 1000,
	},
	2: {
		title: 'Battle 2 - NFC Lisbon',
		artists: [artist2, artist1],
		startsAt: 1649078087000,
		duration: 45 * 60 * 1000,
	},
	3: {
		title: 'Losing Bracket - NFC Lisbon',
		artists: [artist3, artist1],
		startsAt: 1649154600000,
		duration: 45 * 60 * 1000,
	},
	4: {
		title: 'Final - NFC Lisbon',
		artists: [artist4, artist2],
		startsAt: 1649176200000,
		duration: 30 * 60 * 1000,
	},
};
