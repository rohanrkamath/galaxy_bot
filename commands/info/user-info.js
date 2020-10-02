const Discord = require('discord.js')
const moment = require('moment')
module.exports = {  //export data in Node.js so that you can require() it in other files
	name: 'user-info',
    description: 'Gives information about the user.',
    aliases: ['userinfo', 'info'],
    usage: '<Username>',
    cooldown: 15,
	execute(client, message, args) {
        const flags = {
            DISCORD_EMPLOYEE: 'Discord Employee',
            DISCORD_PARTNER: 'Discord Partner',
            BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
            BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
            HYPESQUAD_EVENTS: 'HypeSquad Events',
            HOUSE_BRAVERY: 'House of Bravery',
            HOUSE_BRILLIANCE: 'House of Brilliance',
            HOUSE_BALANCE: 'House of Balance',
            EARLY_SUPPORTER: 'Early Supporter',
            TEAM_USER: 'Team User',
            SYSTEM: 'System',
            VERIFIED_BOT: 'Verified Bot',
            VERIFIED_DEVELOPER: 'Verified Bot Developer'
        };
        /*if (!message.mentions.users.size) {
            const embed = new Discord.MessageEmbed()
            .setTitle('User Description')
            .setDescription('Some info about the user! Any more suggestions? Use !bot-info command to get owner details and chat with him!')
            .addField('Username:', `${message.author.username}`)
            .addField('ID', `${message.author.id}`)
            .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
            .setColor('RANDOM')
            .setTimestamp()
            message.channel.send(embed);
        }
        else if (message.mentions.users.size && message.mentions.users.first()) {
            var taggedUser = message.mentions.users.first();
            const embed = new Discord.MessageEmbed()
            .setTitle('User Description')
            .setDescription('Some info about the user! Any more suggestions? Use !bot-info command to get owner details and chat with him!')
            .addField('Username:', `${taggedUser.username}`)
            .addField('ID', `${taggedUser.id}`)
            .setThumbnail(taggedUser.displayAvatarURL({dynamic: true}))
            .setColor('RANDOM')
            .setTimestamp()
            message.channel.send(embed);
        }*/

        function trimArray(arr, maxLen = 10) {
			if (arr.length > maxLen) {
				const len = arr.length - maxLen;
				arr = arr.slice(0, maxLen);
				arr.push(`${len} more...`);
			}
			return arr;
        }
        
        const member = message.mentions.members.last() || message.guild.members.cache.get(args[0]) || message.member;
		const roles = member.roles.cache
			.sort((a, b) => b.position - a.position)
			.map(role => role.toString())
			.slice(0, -1);
		const userFlags = member.user.flags.toArray();
        const embed = new Discord.MessageEmbed()
            .setTitle('User Description')
            .setDescription('Some info about the user! Any more suggestions? Use !bot-info command to get owner details and chat with him!')
            .addField('__Status__', [
                `**❯ Status:** ${member.user.presence.status}`,
                `**❯ Game:** ${member.user.presence.game || 'Not playing a game.'}`,
                `\u200b`
            ])
			.addField('__User__', [
				//`**❯ Username:** ${member.user.username}`,
                //`**❯ Discriminator:** ${member.user.discriminator}`,
                `**❯ User Tag:** ${member.user.tag}`,
				`**❯ User ID:** ${member.id}`,
				`**❯ Flags:** ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`,
				`**❯ Avatar:** [Link to avatar](${member.user.displayAvatarURL({ dynamic: true })})`,
				`**❯ Time Created:** ${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} ${moment(member.user.createdTimestamp).fromNow()}`,
				`\u200b`
            ])
            .addField('__Member__', [
				`**❯ Highest Role:** ${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest.name}`,
				`**❯ Server Join Date:** ${moment(member.joinedAt).format('LL LTS')}`,
				`**❯ Hoist Role:** ${member.roles.hoist ? member.roles.hoist.name : 'None'}`,
				`**❯ Roles [${roles.length}]:** ${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? trimArray(roles) : 'None'}`,
				`\u200b`
            ])

            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor('RANDOM')
            .setTimestamp();
		    message.channel.send(embed);
    },
};