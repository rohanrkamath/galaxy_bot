const Discord = require('discord.js');
module.exports = {  //export data in Node.js so that you can require() it in other files
	name: 'avatar',
    description: 'Displays avatar of users.',
    aliases: ['icon', 'pfp'],
    usage : [],
    guildOnly: true,
	execute(client, message, args) {
        const member = message.mentions.users.first() || message.author;
        const avatar = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setAuthor(member.username)
        .setImage(member.displayAvatarURL({dynamic:true}))
        .setTimestamp()
        message.channel.send(avatar);

		/*if (!message.mentions.users.size) {
            return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: "png", dynamic: true })}>`);
        }
    
        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: <${user.displayAvatarURL({ format: "png", dynamic: true })}>`;
        });
        message.channel.send(avatarList);*/
    },
};
