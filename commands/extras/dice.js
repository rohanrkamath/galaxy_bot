const {prefix} = require('../../config');
const Discord = require('discord.js');
module.exports = {  //export data in Node.js so that you can require() it in other files
	name: 'dice',
    description: 'Roll the dice.',
    usage: [],

    execute(client, message, args) {
        //if(message.content === `${prefix}dice`){ 
            message.channel.send(`🎲 Rolling the die...`).then((msg) => {
                const number = Math.floor(Math.random() * 6) + 1;
                const embed = new Discord.MessageEmbed() 
                    .setTitle(`Your number is...\n**${number}**!`)
                    .setTimestamp()
                    .setColor('RANDOM')
                //console.log(number);
            msg.edit(embed);
            msg.edit("\u200B")
            })
        //}
    }
}