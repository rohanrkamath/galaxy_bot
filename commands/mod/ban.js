const Discord = require("discord.js");

module.exports = {
  name: "ban",
  description: "Ban member from the server. Permissions applied.",
  usage: "<Username | UserID> <reason>",
  cooldown: 10,
  guildOnly: true,
  execute(client, message, args) {
    let target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!target)
      return message.channel.send("Please mention a user to be banned!");

    let reason;
    let arg = message.content.split(" ").slice(2);

    if (arg.length == 0) {
      reason = "No reason specified.";
    } else {
      reason = arg.join(" ");
    }

    if (!message.member.hasPermission("BAN_MEMBERS"))
      return message.channel.send(
        "You dont have the permission to use this command!"
      );
    if (target.id === message.author.id)
      return message.channel.send("You cannot ban yourself!");
    if (target.user.bot)
      return message.channel.send(
        "Sorry we dont ban other bots. Please do so manually!"
      );
    if (
      target.permissions.has("BAN_MEMBERS") &&
      message.member != message.guild.owner
    )
      return message.channel.send("You have not BAN_MEMBERS permissions");
    if (!message.guild.member(target).bannable)
      return message.channel.send("Sorry cant ban that user!");

    const embed = new Discord.MessageEmbed()
      .setTitle("You have been **banned!**")
      .addField("Server Name: ", `**${message.guild.name}**`)
      .addField("Banned by:", `**${message.author.username}**`)
      .addField("Reason: ", `**${reason}**`)
      .setColor("RANDOM")
      .setThumbnail(message.guild.iconURL())
      .setTimestamp();

    //message.delete()

    target
      .send(embed)
      .then(() => {
        const ban = new Discord.MessageEmbed().setTitle(
          `${target.user.tag} has been banned!`
        );
        message.channel.send(ban);
        //message.channel.send(`**${target.user.tag}** has been banned!`)
      })
      .then(() => {
        message.guild.member(target).ban({ days: 7 }); //message.channel.send(`${member.user.tag} has been kicked!`)
      })
      .then(() => {
        const emb_log = new Discord.MessageEmbed()
          .setTitle("Member Banned")
          .addField("Member name: ", `${target.user.tag}`, true)
          .addField("Banned By: ", `${message.author.username}`, true)
          .addField("Member ID: ", `${target.id}`, true)
          .addField("Reason: ", `${reason}`, true)
          .setColor("RANDOM")
          .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
          .setTimestamp();

        const channel = message.member.guild.channels.cache.find(
          (ch) => ch.name === "add log channel name"
        );
        if (!channel) return;

        channel.send(emb_log);
      });
  },
};
