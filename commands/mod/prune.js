const Discord = require("discord.js");
module.exports = {
  //export data in Node.js so that you can require() it in other files
  name: "prune",
  description: "Purges up too 99 messages",
  aliases: ["purge"],
  usage: "<integer between 1-99>",
  cooldown: 8,
  guildOnly: true,
  execute(client, message, args) {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send(
        "You dont have the permission to use this command!"
      );
    const actual_amount = parseInt(args[0]);
    const amount = parseInt(args[0]) + 1; //parseInt parses a string and returns an interger. +1 is as for delete the !prune 2 (current command) and other 2 commands.
    //console.log(amount)

    if (isNaN(amount)) {
      //isNan is used to check if input is number or not
      return message.reply(
        "That doesn't seem to be a valid number, type !help to check usage!"
      );
    } else if (amount <= 1 || amount > 100) {
      return message.reply(
        "You need to input a number between 1 and 99, type !help to check usage!"
      );
    }

    message.channel
      .bulkDelete(amount, true)
      .then(() => {
        const emb_log = new Discord.MessageEmbed()
          .setTitle("Messages Deleted")
          .addField("Member name: ", `${message.author.tag}`, true)
          .addField("Member Id: ", `${message.author.id}`, true)
          .addField("Messages deleted: ", actual_amount, true)
          .setColor("RANDOM")
          .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp();

        const channel_log = message.guild.channels.cache.find(
          (ch) => ch.name === "add log channel name"
        );
        if (!channel_log) return;

        channel_log.send(emb_log);
      })
      .catch((err) => {
        //true parameter in bulkDelete filters out messages older than 2 weeks. Catch block is for when all the messages to be deleted are 2 weeks old

        console.error(err);
        message.channel.send(
          "there was an error trying to prune messages in this channel, type !help to check usage!"
        );
      });
  },
};
