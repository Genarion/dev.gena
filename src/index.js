// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});



client.on('messageCreate', message => {
  if ( message.type === 'APPLICATION_COMMAND' && message.interaction.commandName === 'debug' && message.embeds[0].description.includes('Server') ){
    console.log('funciona')
  }else{
    console.log('no funciona')
    console.log(message)
  }
})




// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);


