const Discord = require('discord.js')
module.exports = {  //export data in Node.js so that you can require() it in other files
	name: 'ping',
	aliases: ['latency'],
	usage: [],
	description: 'Returns Latency and API ping',
	cooldown: 3,
	execute(client, message, args) {
		//message.channel.send('Pong.');
		message.channel.send(`🏓 Pinging....`).then((msg) => {
			const embed = new Discord.MessageEmbed()
			  .setTitle("🏓 Pong! 🏓")
			  .setDescription(
				`\nThe Latency => ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms\nThe API Latency => ${Math.round(client.ws.ping)}ms`)
			  .setColor("RANDOM");
			msg.edit(embed);
			msg.edit("\u200B");
		  });
	},
};

