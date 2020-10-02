const { MessageEmbed, version: djsversion } = require("discord.js");
const { version } = require("../../package.json");
const { utc } = require("moment");
const os = require("os");
const ms = require("ms");
module.exports = {
  name: "bot-info",
  aliases: ["botinfo", "galaxy-info", "Galaxy-info", "dev-info"],
  usage: [],
  description: "Some information about me!",
  guildOnly: true,
  execute(client, message, args) {
    /*let embed = new Discord.MessageEmbed()
		.setTitle(`About ${client.user.username} Bot!`)
		.setDescription(`Hello! I am ${client.user.username} bot! To know more about me, check out the [Docs](https://www.galaxybot.xyz/)!\n**Few rules though-**\n1. Only DM the owner about bugs/issues via Discord/Twitter.\n2. Refrain from asking help in code, bot-dev and personal questions.\n3. If you want a custom bot for your server, place an official order. Prices negotiable.\n4. Dont forget to follow him on twitter!`)
		.addField('Developer:', 'Amish#1337', true)
		.addField('Current server:', `${message.guild.name}`, true)
		.addField('Birthday:', '19th April 2020', true)
		.addField('Owner\'s Twitter:', '@Lordkama1337', true)
		.addField('Currently servering', `${client.guilds.cache.size} servers`, true)
		.addField('Serving:', `${client.users.cache.size} users`, true)
		.setThumbnail(client.user.avatarURL())
		.setColor('RANDOM')
		.setTimestamp()
		
		message.channel.send(embed);*/

    function formatBytes(bytes) {
      if (bytes === 0) return "0 Bytes";
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${
        sizes[i]
      }`;
    }

    let core = os.cpus()[0];
    let embed = new MessageEmbed()
      .setTitle(`Bot Description`)
      .setDescription(
        `Some info about the bot! Any more suggestions? Contact the owner and let him know!`
      )
      .addField("__Overview__", [
        `**❯ Bot:** ${client.user.tag} (${client.user.id})`,
        //`**❯ Commands:** ${client.commands.size}`,
        `**❯ Servers:** ${client.guilds.cache.size.toLocaleString()}`,
        `**❯ Users:** ${client.guilds.cache
          .reduce((a, b) => a + b.memberCount, 0)
          .toLocaleString()}`,
        `**❯ Channels:** ${client.channels.cache.size.toLocaleString()}`,
        `**❯ Creation Date:** ${utc(client.user.createTimestamp).format(
          "Do MMMM YYYY HH:mm:ss"
        )}`,
      ])
      .addField("__Developer Details__", [
        `**❯ Developer:** _Amishhh#1337`,
        `**❯ Twitter:** @rohan__kamath`,
      ])
      .addField("__System Software__", [
        `**❯ Node.js:** ${process.version}`,
        `**❯ Version:** v${version}`,
        `**❯ Discord.js:** v${djsversion}`,
      ])
      .addField("__System Hardware__", [
        `**❯ Platform:** ${process.platform}`,
        `**❯ Uptime:** ${ms(os.uptime() * 1000, { long: true })}`,
        `**❯ CPU:**`,
        `\u3000 Cores: ${os.cpus().length}`,
        `\u3000 Model: ${core.model}`,
        `\u3000 Speed: ${core.speed}MHz`,
        `**❯ Memory:**`,
        `\u3000 Total: ${formatBytes(process.memoryUsage().heapTotal)}`,
        `\u3000 Used: ${formatBytes(process.memoryUsage().heapUsed)}`,
      ])
      .setThumbnail(client.user.avatarURL())
      .setColor("RANDOM")
      .setTimestamp();
    message.channel.send(embed);
  },
};
