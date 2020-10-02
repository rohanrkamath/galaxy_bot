const { prefix } = require("../../config.json");
const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "List of all commands along with their information",
  aliases: ["commands", "help"],
  usage: "<command name>",
  cooldown: 5,
  execute(client, message, args) {
    const { commands } = message.client;

    /*if (!args.length) {
            let embed = new Discord.MessageEmbed()
            .setTitle("Here's a list of all my commands:")
            .setDescription(commands.map(cmd => cmd.name).join("\n")) 
            .setFooter(`Use \`${prefix}help [command name]\` to get info on a specific command!`)
            .setColor('RANDOM')
			.setTimestamp()	
        message.author.send(embed)
        .then(() => {
            message.reply('I\'ve sent you a DM with all my commands!')
        })
        .catch(error => {
            console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
            message.reply('it seems like I can\'t DM you! Do you have DMs disabled? Anyways here are your commands!');
            message.channel.send(embed)
        });
        
        }*/

    if (!args.length) {
      let embed = new Discord.MessageEmbed()
        .setDescription(
          "**Galaxy Discord Bot**\n\nPlease check the website for a clean and explained documention about the bot and its commands."
        )
        .addField(
          "Links",
          ">[Website](https://www.galaxybot.xyz/)\n>[Community](https://discord.com/invite/RbcCgez)\n>[Donate](https://www.paypal.me/discordgalaxybot)\n>[Twitter](https://twitter.com/rohan__kamath) "
        )
        .setFooter(
          `Use \`${prefix}help [command name]\` to get info on a specific command!`
        )
        .setColor("RANDOM")
        .setThumbnail(client.user.avatarURL())
        .setTimestamp();
      message.channel.send(embed);
    } else {
      const name = args[0].toLowerCase();
      const command =
        commands.get(name) ||
        commands.find((c) => c.aliases && c.aliases.includes(name));

      if (!command) {
        return message.reply("that's not a valid command!");
      }
      let embed2 = new Discord.MessageEmbed()
        //.addField('**Description**', )
        .setTitle(`**Command name :** ${name}`)
        .addField("**Description**", `${command.description}`)
        .addField("**Usage**", `${prefix}${command.name} ${command.usage}`)
        .addField("**Cooldown**", `${command.cooldown || 3} second(s)`)
        .setColor("RANDOM")
        .setTimestamp();
      if (!command.aliases) embed2.addField(`**Aliases**`, "None");
      if (command.aliases)
        embed2.addField("**Aliases**", `${command.aliases.join(", ")}`);
      message.channel.send(embed2);
    }
  },
};
