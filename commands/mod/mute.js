const Discord = require("discord.js");
//const {prefix} = require('../../config.json')
const ms = require("ms");

module.exports = {
  //export data in Node.js so that you can require() it in other files
  name: "mute",
  description: "Mute member. Permissions applied.",
  usage: "<Username | UserID> <reason>",
  //args: true,
  cooldown: 10,
  guildOnly: true,
  async execute(client, message, args) {
    let target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!target)
      return message.channel.send("Please enter a valid username or ID");
    if (target.id === message.author.id)
      return message.channel.send("You cannot mute yourself.");
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send("You dont have the rights to mute members");
    if (
      message.member.hasPermission("ADMINISTRATOR") &&
      target.hasPermission("ADMINISTRATOR")
    )
      return message.channel.send("You cant mute admins.");

    //if(target.permissions.has('ADMINISTRATOR')) return message.channel.send('You cant mute members having the same or higher roles.')
    //if(message.member.hasPermission('MANAGE_MESSAGES') && (target.hasPermission('ADMINISTRATOR'))) return ('You can mute admins.')
    if (
      message.member.hasPermission(
        ("ADMINISTRATOR" && target.hasPermission("KICK_MEMBERS")) ||
          message.member.hasPermission("ADMINISTRATOR")
      )
    ) {
      let mute_role = message.guild.roles.cache.find((r) => r.name === "Muted");
      if (!mute_role) {
        try {
          mute_role = await message.guild.roles.create({
            data: {
              name: "Muted",
              color: "#000000",
              permissions: [],
            },
            reason: "Role for Muted members",
          });
          message.guild.channels.cache.forEach(async (channel) => {
            await channel.createOverwrite(mute_role, {
              SEND_MESSAGES: false,
              SEND_TTS_MESSAGES: false,
              ADD_REACTIONS: false,
            });
          });
        } catch (e) {
          console.log(e.stack);
        }
      }

      let rawTime = args[1];
      if (!rawTime)
        return message.channel.send("Please enter the duration of the mute.");
      let time = ms(rawTime);

      let reason;
      let rawReason = message.content.split(" ").slice(3);
      if (rawReason.length == 0) {
        reason = "No reason specified.";
      } else {
        reason = rawReason.join(" ");
      }

      if (target.roles.cache.has(mute_role.id))
        return message.channel.send("This member is already muted!");

      await target.roles.add(mute_role.id);
      const mute = new Discord.MessageEmbed().setTitle(
        `${target.user.tag} has been muted!`
      );
      message.channel
        .send(mute)
        .then(() => {
          const embed = new Discord.MessageEmbed()
            .setTitle("You have been **muted!**")
            .addField("Server Name: ", `**${message.guild.name}**`)
            .addField("Muted by: ", `**${message.author.username}**`)
            .addField("Expires: ", `**${rawTime}**`)
            .addField("Reason: ", `**${reason}**`)
            .setColor("RANDOM")
            .setTimestamp();

          target.send(embed);
        })
        .then(() => {
          const emb_log = new Discord.MessageEmbed()
            .setTitle("Member muted")
            .addField("Member name: ", `${target.user.tag}`, true)
            .addField("Muted By: ", `${message.author.username}`, true)
            .addField("Duration of mute: ", `**${rawTime}**`, true)
            .addField("Reason: ", `${reason}`, true)
            .setColor("RANDOM")
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

          const channel = message.member.guild.channels.cache.find(
            (ch) => ch.name === "galaxy-logs"
          );
          if (!channel) return;

          if (channel) {
            channel.send(emb_log);
          }
        });

      setTimeout(async () => {
        await target.roles.remove(mute_role);
        const unmute = new Discord.MessageEmbed().setTitle(
          `${target.user.tag} has been unmuted!`
        );
        message.channel.send(unmute);

        const embed2 = new Discord.MessageEmbed()
          .setTitle("You have been **unmuted!**")
          .addField("Server Name: ", `**${message.guild.name}**`)
          .addField("Unmuted by: ", `**${message.author.username}**`)
          .addField("Duration of mute: ", `**${rawTime}**`)
          .addField("Reason for mute: ", `**${reason}**`)
          .setColor("RANDOM")
          .setTimestamp();

        target.send(embed2).then(() => {
          const emb_log = new Discord.MessageEmbed()
            .setTitle("Member unmuted")
            .addField("Member name: ", `${target.user.tag}`, true)
            .addField("Unmuted By: ", `${message.author.username}`, true)
            .addField("Duration of mute: ", `**${rawTime}**`, true)
            .addField("Reason for mute: ", `${reason}`, true)
            .setColor("RANDOM")
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

          const channel = message.member.guild.channels.cache.find(
            (ch) => ch.name === "add log channel name"
          );
          if (!channel) return;

          if (channel) {
            channel.send(emb_log);
          }
        });
      }, time);

      return;
    }
  },
};
