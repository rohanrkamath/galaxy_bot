module.exports = { //export data in Node.js so that you can require() it in other files
	name: 'beep',
	description: 'Beep!',
	execute(client, message, args) {
		message.channel.send('Boop.');
	},
};