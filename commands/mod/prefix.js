const Discord = require("discord.js");
const fs = require("fs");
const config = require("../../config.json");

module.exports = {
  //export data in Node.js so that you can require() it in other files
  name: "prefix",
  usage: [],
  description: "Returns Latency and API ping",
  cooldown: 3,
  execute(client, message, args) {
    let prefixes = JSON.parse(fs.readFileSync("./prefix.json", "utf-8"));
    if (!prefixes[message.guild.id]) {
      prefixes[message.guild.id] = {
        prefix: config["prefix"],
      };
    }
    let prefix = prefixes[message.guild.id].prefix;

    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.reply("you do not have the permissions!");
    if (!args[0]) return message.reply("Please enter a prefix to be set!");

    prefixes[message.guild.id] = {
      prefix: args[0],
    };

    fs.writeFile("./prefix.json", JSON.stringify(prefixes), (err) => {
      if (err) console.log(err);
    });

    let embed = new Discord.MessageEmbed()
      .setTitle(`Prefix set to \`${args[0]}\``)
      .setColor("RANDOM");

    message.channel.send(embed);

    const emb_log = new Discord.MessageEmbed()
      .setTitle(`Bot prefix changed: \`${args[0]}\``)
      .addField("Changed by: ", `${message.author.username}`, true)
      .addField("Default Prefix ", `\`?g\``, true)
      .setColor("RANDOM")
      .setThumbnail(message.guild.iconURL())
      .setTimestamp();

    const channel = message.member.guild.channels.cache.find(
      (ch) => ch.name === "add log channel name"
    );
    if (!channel) return;

    channel.send(emb_log);
  },
};
