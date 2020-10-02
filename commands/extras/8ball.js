const Discord = require('discord.js');

module.exports = {
    name: "8ball",
    description: "Ask a question, get a answer! ",
    aliases: ["8b", "magic8", "magic8ball"],
    usage: "[question]",
    execute: async function(client, message, args) {
        const rand = ["Yes",
        "No",
        "Why are you even trying?",
        "What do you think? NO",
        "Maybe",
        "Never",
        "Yep",
        "I wouldn't do that if I were you",
        "...",
        "It is certain",
		"It is decidedly so",
		"Without a doubt",
		"Yes – definitely",
		"You may rely on it",
		"As I see it",
		"Most Likely",
		"Outlook good",
		"Yes",
		"Signs point to yes"];
        const randomMessage = rand[Math.floor(Math.random() * rand.length)];
        /*const ball = {embed:{
            color: 3447003,
            title: `:8ball: ${randomMessage} :8ball:`,
            description: `${message.author}`
        }}*/

        const ball = new Discord.MessageEmbed()
        .setTitle(`:8ball: ${randomMessage} :8ball:`)
        //.setDescription(`${message.author}`)
        .setDescription(`**❯** The question was asked by ${message.author} **❮**`)
        .setColor('RANDOM')
        message.channel.send(ball)
    }
}