const Discord = require('discord.js');
const moment = require('moment');
module.exports = {  //export data in Node.js so that you can require() it in other files
	name: 'server-info',
	usage: [],
	aliases: ['serverinfo'],
	description: 'Gives basic information about the server!',
	execute(client, message, args) {
		const filterLevels = {
			DISABLED: 'Off',
			MEMBERS_WITHOUT_ROLES: 'No Role',
			ALL_MEMBERS: 'Everyone'
		};

		const verificationLevels = {
			NONE: 'None',
			LOW: 'Low',
			MEDIUM: 'Medium',
			HIGH: '(╯°□°）╯︵ ┻━┻',
			VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
		};

		const regions = {
			brazil: 'Brazil',
			europe: 'Europe',
			hongkong: 'Hong Kong',
			india: 'India',
			japan: 'Japan',
			russia: 'Russia',
			singapore: 'Singapore',
			southafrica: 'South Africa',
			sydeny: 'Sydeny',
			'us-central': 'US Central',
			'us-east': 'US East',
			'us-west': 'US West',
			'us-south': 'US South'
		};
		//get admins
		const adminMembers = message.guild.members.cache.filter(e => e.permissions.has("ADMINISTRATOR"));
		const admin = adminMembers.map(e => e.user.username);//.array();
		const str = admin.join(", ");

		const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
		const members = message.guild.members.cache;
		const channels = message.guild.channels.cache;
		const emojis = message.guild.emojis.cache;

		function checkDays(date) {
			let now = new Date();
			let diff = now.getTime() - date.getTime();
			let days = Math.floor(diff / 86400000);
			return days + (days == 1 ? " day" : " days") + " ago";
		};

		function trimArray(arr, maxLen = 10) {
			if (arr.length > maxLen) {
				const len = arr.length - maxLen;
				arr = arr.slice(0, maxLen);
				arr.push(`${len} more...`);
			}
			return arr;
		}

		let embed = new Discord.MessageEmbed()
		.setTitle('Server Description')
		.setDescription('Some info about this server! Any more suggestions? Use `!bot-info` command to get owner details and chat with him!')
		//.addField('Server name:', `${message.guild.name}`, true)
		//.addField('Total members:', `${message.guild.memberCount}`, true)
		//.addField('Admins', `${str}`, true)
		//.addField('When joined', `${message.guild.joinedAt}`)
		//if (!message.guild.iconURL == null) embed.setThumbnail(message.guild.iconURL)
		.addField('__General__', [
			`**❯ Name:** ${message.guild.name} (${message.guild.id})`,
			//`**❯ ID:** ${message.guild.id}`,
			`**❯ Owner:** ${message.guild.owner.user.tag} (${message.guild.ownerID})`,
			`**❯ Region:** ${regions[message.guild.region]}`,
			`**❯ Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
			`**❯ Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}`,
			`**❯ Verification Level:** ${verificationLevels[message.guild.verificationLevel]}`,
			//`**❯ Time Created:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} ${moment(message.guild.createdTimestamp).fromNow()}`,
			`**❯ Creation Date** ${message.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})}`,
			'\u200b'
		])

		.addField('__Statistics__', [
			`**❯ Role Count:** ${roles.length}`,
			`**❯ Emoji Count:** ${emojis.size}`,
			`**❯ Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
			`**❯ Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
			`**❯ Member Count:** ${message.guild.memberCount}`,
			`**❯ Humans:** ${members.filter(member => !member.user.bot).size}`,
			`**❯ Bots:** ${members.filter(member => member.user.bot).size}`,
			`**❯ Text Channels:** ${channels.filter(channel => channel.type === 'text').size}`,
			`**❯ Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
			`**❯ Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`,
			'\u200b'
		])

		.addField('__Members Status__', [
			`**❯ Online:** ${members.filter(member => member.presence.status === 'online').size}`,
			`**❯ Idle:** ${members.filter(member => member.presence.status === 'idle').size}`,
			`**❯ Do Not Disturb:** ${members.filter(member => member.presence.status === 'dnd').size}`,
			`**❯ Offline:** ${members.filter(member => member.presence.status === 'offline').size}`,
			'\u200b'
		])
		.addField(`__Roles__ [${roles.length - 1}]`, roles.length < 10 ? roles.join(', ') : roles.length > 10 ? trimArray(roles) : 'None')
		.addField(`__Admin Privs__ [${admin.length}]`, `${str}`)
		.setThumbnail(message.guild.iconURL())
		.setColor('RANDOM')
		.setTimestamp()
		
		//message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
		message.channel.send(embed);
	},
};
