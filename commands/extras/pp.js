const Discord = require('discord.js');
module.exports = {  //export data in Node.js so that you can require() it in other files
	name: 'pp',
    description: 'Shows your pp size',
    usage: [],
    execute(client, message, args) {
        let size = Math.floor(Math.random() * 10) + 1;
         
        for (i=0; i<=size; i++) {
            pp = '='.repeat(size); 
        }
        pp_size = ('B'+pp+'D')

        if (!message.mentions.users.size) {
            const embed = new Discord.MessageEmbed()
            .setTitle(`Your pp size is...\n${pp_size}`)
            .setColor('RANDOM')
            .setTimestamp()
            message.reply(embed);
        }

        else if (message.mentions.users.size && message.mentions.users.first()) {
            var taggedUser = message.mentions.users.first();
            const embed = new Discord.MessageEmbed()
            .setTitle(`${taggedUser.username}'s pp size is...\n${pp_size}`)
            .setColor('RANDOM')
            .setTimestamp()
            message.channel.send(embed);
        }
    }
}