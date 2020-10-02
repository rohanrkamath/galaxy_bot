const Discord = require("discord.js");
module.exports = {
  name: "softban",
  description: "Ban member from the server temporarily. Permissions applied.",
  usage: "<Username | UserID> <reason>",
  cooldown: 10,
  guildOnly: true,
  execute(client, message, args) {
    let target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!target)
      return message.channel.send("Please mention a user to be soft-banned!");

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
      return message.channel.send("You cannot soft-ban yourself!");
    if (target.user.bot)
      return message.channel.send(
        "Sorry we dont soft-ban other bots. Please do so manually!"
      );
    if (
      target.permissions.has("MUTE_MEMBERS") &&
      message.member != message.guild.owner
    )
      return message.channel.send("You have not BAN_MEMBERS permissions");
    if (!message.guild.member(target).bannable)
      return message.channel.send("Sorry cant ban that user!");

    const emb_log = new Discord.MessageEmbed()
      .setTitle("Member Soft-banned")
      .addField("Member name: ", `${target.user.tag}`, true)
      .addField("Soft-banned By: ", `${message.author.username}`, true)
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

    const embed = new Discord.MessageEmbed()
      .setTitle("You have been **softbanned!**")
      .addField("Server Name: ", `**${message.guild.name}**`)
      .addField("Banned by:", `**${message.author.username}**`)
      .addField("Reason: ", `**${reason}**`)
      .setColor("RANDOM")
      .setThumbnail(`${message.guild.iconURL()}`)
      .setTimestamp();

    //message.delete()

    target
      .send(embed)
      .then(() => {
        const soft_ban = new Discord.MessageEmbed().setTitle(
          `${target.user.tag} has been soft-banned!`
        );
        message.channel.send(soft_ban);
      })
      .then(() => {
        //message.guild.member(target).ban().then(() => message.guild.member(target).unban())
        //message.guild.ban(target, {days: 1, reason: reason}).then(() => message.guild.unban(target.id, {reason: 'softban'})).catch(err => console.log(err))
        message.guild
          .member(target)
          .ban({
            days: 7,
            reason: "Take this as a warning, may even lead to a perma ban!",
          })
          .then(() => message.guild.members.unban(target.id))
          .catch((err) => console.log(err));
      });
  },
};
