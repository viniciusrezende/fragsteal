var fs = require('fs')
var Discord = require('discord.js');
var bot = new Discord.Client();
var isReady = true;

try {
	var BotConfig = require("./bot.json");
} catch (e){
	console.log("Please create an bot.json like bot.json.example with a bot token.\n"+e.stack);
	process.exit(); 
}

bot.on('message', message => {
 	if (isReady && 0 === message.content.indexOf( BotConfig.cmd_prefix ) ) {
		isReady = false;
		var fileName = './' + message.content.substring( BotConfig.cmd_prefix.length ) + '.mp3';
		var voiceChannel = message.member.voiceChannel;
		if ( typeof voiceChannel != typeof undefined && true === fs.existsSync( fileName ) ) {
			voiceChannel.join().then(connection =>
			{
				const dispatcher = connection.playFile( fileName );
				dispatcher.on("end", end => {
					voiceChannel.leave();
				});
			}).catch(err => console.log(err));
			isReady = true;
		}
	}
});
bot.login( BotConfig.bot_token );
