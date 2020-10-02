const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
  //export data in Node.js so that you can require() it in other files
  name: "unmute",
  description: "Unmute member. Permissions applied.",
  usage: "<Username | UserID> <reason>",
  //args: true,
  cooldown: 10,
  guildOnly: true,
  async execute(client, message, args) {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send("You dont have the rights to unmute members");

    let target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!target)
      return message.channel.send("Please enter a valid username or ID");
    if (target.id === message.author.id)
      return message.channel.send("You cannot unmute yourself.");
    if (
      target.permissions.has("MANAGE_MESSAGES") &&
      message.member != message.guild.owner
    )
      return message.channel.send(
        "You cant unmute members having the same or higher roles."
      );

    let mute_role = message.guild.roles.cache.find((r) => r.name === "Muted");
    if (!mute_role || !target.roles.cache.has(mute_role.id))
      return message.channel.send("This user is not muted!");

    await target.roles.remove(mute_role);
    const unmute = new Discord.MessageEmbed().setTitle(
      `${target.user.tag} has been unmuted!`
    );
    message.channel.send(unmute);

    const emb_log = new Discord.MessageEmbed()
      .setTitle("Member unmuted")
      .addField("Member name: ", `${target.user.tag}`, true)
      .addField("Unmuted By: ", `${message.author.username}`, true)
      .setColor("RANDOM")
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    const channel = message.member.guild.channels.cache.find(
      (ch) => ch.name === "add log channel name"
    );
    if (!channel) return;

    channel.send(emb_log);

    const embed = new Discord.MessageEmbed()
      .setTitle("You have been **unbanned!**")
      .addField("Server Name: ", `**${message.guild.name}**`)
      .addField("Unmuted by:", `**${message.author.username}**`)
      .setColor("RANDOM")
      .setThumbnail(`${message.guild.iconURL()}`)
      .setTimestamp();

    target.send(embed);
  },
};
