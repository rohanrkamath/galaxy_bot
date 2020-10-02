const Discord = require('discord.js');
module.exports = {  //export data in Node.js so that you can require() it in other files
	name: 'spank',
    description: 'Spank \'em',
    usage: [],
    execute(client, message, args) {
        if (!message.mentions.users.size) {
            const embed = new Discord.MessageEmbed()
            .setTitle(`You spanked yourself, please talk to someone about this 👋`)
            .setColor('RANDOM')
            message.reply(embed);
        }
        else if (message.mentions.users.size && message.mentions.users.first()) {
            var taggedUser = message.mentions.users.first();
            const embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.username} spanked ${taggedUser.username}'s ass, handprints visible bro? 👋`)
            .setColor('RANDOM')
            message.channel.send(embed);
        }
    }
}