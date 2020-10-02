const Discord = require('discord.js');
module.exports = {  //export data in Node.js so that you can require() it in other files
	name: 'slap',
    description: 'Slap \'em',
    usage: [],
    execute(client, message, args) {
        if (!message.mentions.users.size) {
            const embed = new Discord.MessageEmbed()
            .setTitle(`You slapped yourself, you ok bro? 👋`)
            .setColor('RANDOM')
            message.reply(embed);
        }
        else if (message.mentions.users.size && message.mentions.users.first()) {
            var taggedUser = message.mentions.users.first();
            const embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.username} slapped ${taggedUser.username} *hard*, oof. Type F in chat bois 👋`)
            .setColor('RANDOM')
            message.channel.send(embed);
        }
    }
}