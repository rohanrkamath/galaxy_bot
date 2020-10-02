const Discord = require("discord.js");

module.exports = {
  name: "channelunlock",
  description: "Lifts the lockdown",
  aliases: ["ll"],
  usage: "",
  display: true,
  type: "moderation",
  execute: async function (client, message, args) {
    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.channel.send(
        "You don't have enough permissions to do this."
      );
    //if (!message.guild.me.hasPermission("MANAGE_SERVER")) return message.reply("I don't have enough permissions! Please give me `MANAGE SERVER` for this command to work.");
    await message.channel.overwritePermissions([
      {
        id: message.guild.id,
        allow: ["SEND_MESSAGES"],
      },
    ]);
    const lock = new Discord.MessageEmbed().setTitle(
      `This channel has been unlocked by: ${message.author.username}`
    );
    //.setFooter(`Requested by: ${message.author.tag}`,message.author.avatarURL())
    message.channel.send(lock).then(() => {
      const emb_log = new Discord.MessageEmbed()
        .setTitle("Channel Unlocked")
        .addField("Channel name: ", `${message.channel.name}`, true)
        .addField("Channel ID: ", `${message.channel.id}`, true)
        .addField("Unlocked By: ", `${message.author.username}`, true)
        .setColor("RANDOM")
        .setThumbnail(client.user.avatarURL())
        .setTimestamp();

      const channel = message.member.guild.channels.cache.find(
        (ch) => ch.name === "add log channel name"
      );
      if (!channel) return;

      channel.send(emb_log);
    });
  },
};
