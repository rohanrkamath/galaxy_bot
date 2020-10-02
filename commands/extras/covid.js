const Discord = require('discord.js');
const {prefix} = require('../../config.json')
const corona = require('novelcovid');
module.exports = {  //export data in Node.js so that you can require() it in other files
	name: 'covid',
    description: 'Gives Covid stats.',
    usage: '<global | Global> | <country name>',
    aliases: ['corona'],
    async execute(client, message, args) {


        let second_arg = args[0]
        if (!second_arg) return message.channel.send('Please provide an argument.')

        const countrycovid = second_arg.charAt(0).toUpperCase(0) + second_arg.slice(1)
        //console.log(countrycovid)
        const countrydata = await corona.countries({country: countrycovid})
        //console.log(countrydata)
        const country = countrydata.country 
        //console.log(country)


        if(country === countrycovid) {
            //if (!countrycovid === 'global') return;
            const countryembed = new Discord.MessageEmbed()
            .setColor("ff2050")
            .setTitle(`Cases in ${countrycovid}`)
            .setDescription("Number of cases may differ from other sources.")
            .addField("Cases", countrydata.cases, true)
            .addField("Active", countrydata.active, true)
            .addField("Cases Today", countrydata.todayCases, true)
            .addField("Critical Cases", countrydata.critical, true)
            .addField("Deaths", countrydata.deaths, true)
            .addField("Recovered", countrydata.recovered, true)
            message.channel.send(countryembed)
        } 
        else {
            //if (message.content === `${prefix}covid global` || message.content === `${prefix}covid Global` || message.content === `${prefix}corona global` || message.content === `${prefix}corona Global`) {
            //if (countrycovid === 'global' || 'Global') {
                //corona.all()
            if (args[0] === ('global' || 'Global')) {
                const data = await corona.all()
                const coronaembed = new Discord.MessageEmbed()
                .setColor("ff2050")
                .setTitle("Global Cases")
                .setDescription("Number of cases may differ from other sources.")
                .addField("Cases", data.cases, true)
                .addField("Active", data.active, true)
                .addField("Cases Today", data.todayCases, true)
                .addField("Critical Cases", data.critical, true)
                .addField("Deaths", data.deaths, true)
                .addField("Recovered", data.recovered, true)
                message.channel.send(coronaembed)
            } 
        else return message.channel.send('Please enter a country to get its details.')
        }
    }
}