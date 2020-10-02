const Discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const { badwords } = require("./profanity.json");
const profanity = require("profanities");
const ms = require("ms");
const Canvas = require("canvas");
const Guild = require("./models/guild.js");
const Profile = require("./models/profile.js");
const mongoose = require("mongoose");

const client = new Discord.Client();
const cooldowns = new Discord.Collection();
client.mongoose = require("./Utils/mongoose.js");

client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js")); //returns an array of all file anmes in a dir ['ping.js', beep.js, ....]; the filter is used to get only .js files.
const commandFiles_mod = fs
  .readdirSync("./commands/mod")
  .filter((file) => file.endsWith(".js")); //mod folder
const commandFiles_info = fs
  .readdirSync("./commands/info")
  .filter((file) => file.endsWith(".js")); //info folder
const commandFiles_extras = fs
  .readdirSync("./commands/extras")
  .filter((file) => file.endsWith(".js")); //

//file system
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command); //set takes the file name and the path to the file. //command is the path to file and command.name is the name of the file
}

for (const file of commandFiles_info) {
  const command1 = require(`./commands/info/${file}`);
  client.commands.set(command1.name, command1);
}

for (const file of commandFiles_mod) {
  const command2 = require(`./commands/mod/${file}`);
  client.commands.set(command2.name, command2);
}

for (const file of commandFiles_extras) {
  const command3 = require(`./commands/extras/${file}`);
  client.commands.set(command3.name, command3);
}

//Bot coming online event
client.once("ready", () => {
  client.user.setActivity(
    `${client.guilds.cache
      .reduce((a, b) => a + b.memberCount, 0)
      .toLocaleString()} members || g?help`,
    { type: "WATCHING" }
  );
  console.log(
    `Hello! ${client.user.username}-bot watching ${client.guilds.cache.size} servers with ${client.users.cache.size} members is now online!`
  );
});

//Message events
client.on("message", async (message) => {
  //profanity check
  /*for(i=0; i < badwords.length; i++) {
        if(message.content.toLowerCase().includes(badwords[i].toLowerCase())) {
            message.delete()
            message.channel.send('Please refrain from using homophobic and racial slurs.')
        }
    }*/
  //Paying respect.
  let respect_higher = "F";
  let respect_lower = "f";
  if (message.content === respect_higher || message.content === respect_lower) {
    let embed = new Discord.MessageEmbed()
      //.setTitle('F') //🙏
      .setDescription(`${message.author.username} has paid their respects.`)
      .setColor("RANDOM");
    message.channel.send(embed);
  }

  let prefixes = JSON.parse(fs.readFileSync("./prefix.json", "utf-8"));
  if (!prefixes[message.guild.id]) {
    prefixes[message.guild.id] = {
      prefix: config.prefix,
    };
  }
  let prefix = prefixes[message.guild.id].prefix;

  //Invite link
  if (message.content === `${prefix}invite`) {
    const invite = await message.channel.createInvite({
      maxAge: 900,
      maxUses: 1,
    });
    const bot_inv = new Discord.MessageEmbed()
      .setTitle("Invite links")
      .setDescription(
        "Server link is only active for **15mins** and is only **usable once**."
      )
      /*.addField('>Server Invite: ', `${invite}`)
        .addField('>Bot Invite: ', '[Click here](https://discord.com/oauth2/authorize?client_id=715080274785861662&permissions=8&scope=bot)')
        .addField('>Community Invite: ', '[Click here](https://discord.com/invite/RbcCgez)')*/
      .addField("Links", [
        `**❯ Server Invite:** ${invite}`,
        `**❯ Bot Invite:** [Click here](add bot invite link here)`,
        `**❯ Community Invite:** [Click here](add server invite link here)`,
        "\u200b",
      ])
      .setFooter("Incase of any problem, contact the admins or bot developer.")
      .setColor("RANDOM");
    message.channel.send(bot_inv);
  }

  //get prefix
  if (message.content === "galaxy-prefix") {
    const prefix_embed = new Discord.MessageEmbed()
      .setTitle("Prefix")
      .setDescription(`Use this ahead of comamnds for usage: **${prefix}**`)
      .setColor("RANDOM")
      .setTimestamp();
    message.channel.send(prefix_embed);
  }

  //Command Handling
  if (message.content.startsWith(prefix) && !message.author.bot) {
    //edit here
    const args = message.content.slice(prefix.length).split(/ +/); //caveats
    //console.log(args);
    const messageArray = message.content.split(/ +/);
    //console.log(messageArray);
    const cmd = args[1];
    //console.log(cmd);
    const commandName = args.shift().toLowerCase();
    //console.log(commandName);

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      ); //aliases
    if (!command) return;

    if (command.guildOnly && message.channel.type !== "text") {
      return message.reply("I can't execute that command inside DMs!"); //cannot dm this command
    }
    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;
      if (command.usage) {
        reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``; //usage check, in file as usage: '<...>'
      }
      return message.channel.send(reply);
    }
    if (!cooldowns.has(command.name)) {
      //cooldown
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    //console.log(now);
    const timestamps = cooldowns.get(command.name); // gets the collection for the triggered command
    const cooldownAmount = (command.cooldown || 3) * 1000; //3 is default cooldown time, if cooldown isnt set in command files.

    if (timestamps.has(message.author.id)) {
      if (timestamps.has(message.author.id)) {
        const expirationTime =
          timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return message.reply(
            `please wait ${timeLeft.toFixed(
              1
            )} more second(s) before reusing the \`${command.name}\` command.`
          );
        }
      }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      command.execute(client, message, args);
    } catch (error) {
      console.error(error);
      message.reply("there was an error trying to execute that command!");
    }
  }
});

//when the bots enters a server
client.on("guildCreate", (guild) => {
  const newGuild = new Guild({
    _id: mongoose.Types.ObjectId(),
    guildID: guild.id,
    guildName: guild.name,
    ownerID: guild.ownerID,
    ownerUsername: guild.owner.user.username,
  });

  newGuild.save();
  const embed = new Discord.MessageEmbed()
    .setTitle("Greetings!")
    .setDescription(
      "Thank you for letting me a part of this server!\n\nPlease do `g?help` get to know my commands.\nIncase of any queries or bugs, please do `g?botinfo` to get the developers contact info."
    )
    .setThumbnail(guild.iconURL())
    .setColor("RANDOM")
    .setTimestamp();
  guild.owner
    .send(embed)
    .then(console.log("Joined a new guild: " + guild.name))
    .catch((err) => console.error(err));

  personal_log = client.guilds.cache
    .get("add guild id")
    .channels.cache.get("add channel id");
  const log_embed = new Discord.MessageEmbed()
    .setTitle("Bot Joined!")
    .addField("Guild Name: ", `${guild.name}`, true)
    .addField("Guild Owner Name: ", `${guild.owner.user.username}`, true)
    .setColor("RANDOM")
    .setTimestamp();
  personal_log.send(log_embed);
  //personal_log.send(`entered ${guild.name}`)

  //console.log('Joined a new guild: ' + guild.name);
});

//when the bot leaves the server
client.on("guildDelete", (guild) => {
  personal_log = client.guilds.cache
    .get("add guild id")
    .channels.cache.get("add channel id");
  const log_embed = new Discord.MessageEmbed()
    .setTitle("Bot Lefted!")
    .addField("Guild Name: ", `${guild.name}`, true)
    .addField("Guild Owner Name: ", `${guild.owner.user.username}`, true)
    .setColor("RANDOM")
    .setTimestamp();
  personal_log.send(log_embed);
  //personal_log.send(`left ${guild.name}`)

  Guild.findOneAndDelete(
    {
      guildID: guild.id,
    },
    (err) => {
      if (err) console.error(err);
      console.log("Left the server: " + guild.name);
    }
  );
});

//Member joining event and welcome banner
client.on("guildMemberAdd", async (member) => {
  const newProfile = new Profile({
    _id: mongoose.Types.ObjectId(),
    guildID: member.guild.id,
    guildName: member.guild.name,
    userID: member.id,
    username: member.user.tag,
  });

  newProfile
    .save()
    .then(console.log(member.user.tag + " has joined " + member.guild.name));
  const emb_log = new Discord.MessageEmbed()
    .setTitle("Member joined")
    .addField("Member name: ", `${member.user.tag}`, true)
    .addField("Member Id: ", `${member.id}`, true)
    .setColor("RANDOM")
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp();

  const channel_log = member.guild.channels.cache.find(
    (ch) => ch.name === "add desired channel name"
  );
  if (!channel_log) return;

  channel_log.send(emb_log).catch((err) => console.error(err));

  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === "add desired channel name"
  );
  if (!channel) return;

  const canvas = Canvas.createCanvas(750, 400);
  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage("./wallpaper.jpeg"); //to add custom wallpaper, remove existing one and name the name one accordingly
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#FFFFFF";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Slightly smaller text placed above the member's display name
  ctx.font = "normal bold 32px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(
    "Welcome to the server,",
    canvas.width / 2.5,
    canvas.height / 2.4
  );

  const applyText = (canvas, text) => {
    const ctx = canvas.getContext("2d");

    // Declare a base size of the font
    let fontSize = 100; //70

    do {
      // Assign the font to the context and decrement it so it can be measured again
      ctx.font = `${(fontSize -= 10)}px sans-serif`;
      // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (ctx.measureText(text).width > canvas.width - 300);

    // Return the result to use in the actual canvas
    return ctx.font;
  };

  // Add an exclamation point here and below
  ctx.font = applyText(canvas, `${member.displayName}!`);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(
    `${member.displayName}!`,
    canvas.width / 2.5,
    canvas.height / 1.65
  );

  ctx.font = "normal italic 10px Arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("GALAXY BOT", canvas.width / 1.2, canvas.height / 1.1);

  ctx.beginPath();
  ctx.arc(125, 160, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(
    member.user.displayAvatarURL({ format: "jpeg" })
  );
  ctx.drawImage(avatar, 25, 60, 200, 200);

  const attachment = new Discord.MessageAttachment(
    canvas.toBuffer(),
    "welcome-image.png"
  );

  channel.send(``, attachment);

  /*const emb_log = new Discord.MessageEmbed()
    .setTitle('Member joined')
    .addField('Member name: ', `${member.user.tag}`, true)
    .addField('Member Id: ', `${member.user.ID}`)
    .setColor('RANDOM')
    .setThumbnail(member.user.displayAvatarURL({dynamic:true}))
    .setTimestamp()

    const channel_log = message.member.guild.channels.cache.find(ch => ch.name === 'galaxy-logs');
    if (!channel_log) return;

    channel_log.send(emb_log)*/

  //DM
  const wel_embed = new Discord.MessageEmbed()
    .setTitle(`Greetings from Galaxy-Bot!`)
    .setDescription(
      `Hello ${member.user.username}, Welcome to ${member.guild.name}! Enjoy your stay and have a good one.`
    )
    .setColor("RANDOM")
    .setTimestamp();
  //.addField('No of members -', ``)
  member.send(wel_embed);
  //member.send(`Welcome to ${member.guild.name}!`)
});

//Member leaving event
client.on("guildMemberRemove", async (member) => {
  Profile.findOneAndDelete(
    {
      userID: member.id,
    },
    (err) => {
      if (err) console.error(err);
      console.log(member.user.tag + " has left " + member.guild.name);
      const emb_log = new Discord.MessageEmbed()
        .setTitle("Member left")
        .addField("Member name: ", `${member.user.tag}`, true)
        .addField("Member Id: ", `${member.id}`, true)
        .setColor("RANDOM")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

      const channel_log = member.guild.channels.cache.find(
        (ch) => ch.name === "galaxy-logs"
      );
      if (!channel_log) return;

      channel_log.send(emb_log);
    }
  );
});

client.on("shardError", (error) => {
  console.error("A websocket connection encountered an error:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

client.mongoose.init();
client.login(config.token);
