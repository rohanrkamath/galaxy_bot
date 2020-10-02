const Discord = require("discord.js");

module.exports = {
  name: "channellock",
  description: "Locks the channel down (No messages can be sent)",
  aliases: ["lockdown"],
  usage: "<reason>",
  display: true,
  type: "moderation",
  execute: async function (client, message, args) {
    var reason;
    reason = args.join(" ");
    if (args.length == 0) {
      reason = "**No reason Provided**";
    }

    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.channel.send("You don't have the permissions to do this.");
    //if (!message.guild.me.hasPermission("MANAGE_SERVER")) return message.reply("I don't have enough permissions! Please give me `MANAGE SERVER` for this command to work.");
    await message.channel.overwritePermissions([
      {
        id: message.guild.id,
        deny: ["SEND_MESSAGES"],
      },
    ]);
    const lock = new Discord.MessageEmbed()
      .setTitle(`This channel has been locked by: ${message.author.username}.`)
      .setDescription(`Reason: **${reason}**`);
    //.setFooter(`Requested by: ${message.author.tag}`,message.author.avatarURL())
    message.channel.send(lock).then(() => {
      const emb_log = new Discord.MessageEmbed()
        .setTitle("Channel Locked")
        .addField("Channel name: ", `${message.channel.name}`, true)
        .addField("Channel ID: ", `${message.channel.id}`, true)
        .addField("Locked By: ", `${message.author.username}`, true)
        .addField("Reason: ", `${reason}`, true)
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
