const request = require("request");
const Discord = require("discord.js");
const client = new Discord.Client()
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "weather",
    description: "shows the current weather of your city",
    aliases: ["w"],
    usage: "<city name>",
    display: true,
    type: "fun",
    execute: async function(client, message, args,) {    
        try {
        let bom;
        let q = message.content.split(' ').slice(1);
        if (q.length == 0) {
            reason = 'Please enter a valid city' 
        }
        else {
            bom = q.join(' ')
        }
        /*  let reason;
            let rawReason = message.content.split(' ').slice(1);
            if (rawReason.length == 0) {
                reason = 'No reason specified.' 
            }
            else {
                reason = rawReason.join(' ')
            } */
        var url = "http://api.openweathermap.org/data/2.5/weather?q=" + q + "&APPID=7f4b3f7c110c3e5a77f871002fb55792"; 
        request(url, function (e, r, b) {
            var p = JSON.parse(b);
            console.log(p);
            if (p.main != undefined) {
                console.log(message.author.username + " requested the weather ");
                
                const weatherem = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`Weather Of ${p.name}, ${p.sys.country}`)
                .addField(`Temprature:`, Math.round(kelToFar(p.main.temp)) + "°F",true)
                .addField(`Feels Like:`, Math.round(kelToFar(p.main.feels_like)) + "°F",true)
                .addField(`High of:`, Math.round(kelToFar(p.main.temp_max)) + "°F",true)
                .addField(`Low of:`, Math.round(kelToFar(p.main.temp_min)) + "°F",true)
                .addField(`Humidity:`, p.main.humidity + "%",true)
                .setFooter(`Requested by: ${message.author.username}`,message.author.avatarURL)

                message.channel.send(weatherem);
            } else {
                message.channel.send("Please enter a valied city");
            }
        });
        } catch (err) {
                const errEm = new MessageEmbed()
                .setTitle(`An Unknown error occured`)
                .setDescription(`Please run hx!bugreport <error message> to report this. Replace <error message> with the error down below`)
                .addField(`Error:`, "```"+client.clean(err)+"```")
                message.channel.send(errEm)
            }
        function kelToFar(kel) {
            kel = parseFloat(kel);
            return (kel * (9 / 5) - 459.67).toString();
        }
        
}
}