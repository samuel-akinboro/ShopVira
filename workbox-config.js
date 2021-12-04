module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{jpg,png,css,html,js}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};