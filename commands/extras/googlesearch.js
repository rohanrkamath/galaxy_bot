module.exports = {
    name: "googlesearch",
    description: "Search stuff on google",
    aliases: ["google"],
    usage: "<search phrase>",
    execute: async function(client, message, args) {    
        let google = args.join('+')
        let link = `https://www.google.com/search?q=${google}`;
        message.channel.send(link);
    }
}