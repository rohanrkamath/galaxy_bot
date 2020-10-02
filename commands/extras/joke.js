const {prefix} = require('../../config.json');
const Discord = require('discord.js');
const giveMeAJoke = require('discord-jokes');
module.exports = {
    name: 'joke',
    description: 'Gives a joke, hopefully making your day',
    usage: [],
    execute(client, message, args) {

        giveMeAJoke.getRandomDadJoke(joke => {
            const embed = new Discord.MessageEmbed()
            .setDescription(joke)
            .setColor('RANDOM')
            message.channel.send(embed);
        })
    }
}
