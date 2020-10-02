const Discord = require('discord.js');

module.exports ={
    name: 'embed',
    description: 'Embed a given message',
    usage: '<message>',
    args: true,
    execute(client, message, args)  {
        const msg_commas = `${args}`
        const msg = msg_commas.split(',').join(' ');
        let embed = new Discord.MessageEmbed() 
        .setTitle('Embedded above message')
        .setDescription(msg)
        .setColor('RANDOM')
        .setTimestamp()
        message.channel.send(embed);
    }
}

