const mongoose = require("mongoose");
const Discord = require("discord.js");
module.exports = {
  //export data in Node.js so that you can require() it in other files
  name: "kick",
  description: "Kick member from the server. Permissions applied.",
  usage: "<Username | UserID> <reason>",
  //args: true,
  cooldown: 10,
  guildOnly: true,
  execute(client, message, args) {
    const target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!target)
      return message.channel.send("Please mention the user to be kicked!");

    let reason;
    let arg = message.content.split(" ").slice(2);
    //console.log(arg)
    if (arg.length === 0) {
      reason = "No reason specified.";
    } else {
      reason = arg.join(" ");
    }

    if (!message.member.hasPermission("KICK_MEMBERS"))
      return message.channel.send(
        "You dont have the permission to use this command!"
      );
    if (target.id === message.author.id)
      return message.channel.send("You cannot kick yourself!");
    if (target.user.bot)
      return message.channel.send(
        "Sorry we dont kick other bots. Please do so manually!"
      );
    if (
      target.permissions.has("KICK_MEMBERS") &&
      message.member != message.guild.owner
    )
      return message.channel.send(
        "You cant kick members having the same or higher roles."
      );
    if (!message.guild.member(target).kickable)
      return message.channel.send("Sorry cant kick that user!");

    /*const emb_log = new Discord.MessageEmbed()
        .setTitle('Member kicked')
        .addField('Member name: ', `${target.user.tag}`, true)
        .addField('Kicked By: ', `${message.author.username}`, true)
        .addField('Member ID: ', `${target.id}`, true)
        .addField('Reason: ', `${reason}`, true)
        .setColor('RANDOM')
        .setThumbnail(target.user.displayAvatarURL({dynamic:true}))
        .setTimestamp()

        const channel = message.member.guild.channels.cache.find(ch => ch.name === 'galaxy-logs');
        if (!channel) return;
 
        channel.send(emb_log)*/

    const embed = new Discord.MessageEmbed()
      .setTitle("You have been **kicked!**")
      .addField("Server Name: ", `**${message.guild.name}**`)
      .addField("Kicked by:", `**${message.author.username}**`)
      .addField("Reason: ", `**${reason}**`)
      .setColor("RANDOM")
      .setThumbnail(message.guild.iconURL())
      .setTimestamp();

    target
      .send(embed)
      .then(() => {
        const kick = new Discord.MessageEmbed().setTitle(
          `${target.user.tag} has been kicked!`
        );
        message.channel.send(kick);
      })
      .then(() => {
        message.guild.member(target).kick(); //message.channel.send(`${member.user.tag} has been kicked!`)
      })
      .then(() => {
        const emb_log = new Discord.MessageEmbed()
          .setTitle("Member kicked")
          .addField("Member name: ", `${target.user.tag}`, true)
          .addField("Kicked By: ", `${message.author.username}`, true)
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

    //console.log(arg);
  },
};

//server name, member who got kick, member who kicked, time, reason
