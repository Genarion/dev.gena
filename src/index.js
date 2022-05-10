const fs = require('fs');

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let file_content = fs.readFileSync( 'data.json' );
let data = JSON.parse( file_content );


// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');

  setInterval(()=>{

    if( data['user-id'] && ( Date.now() - data.time ) >= ( 2 * 60 * 60 * 1000 ) ) {
      let server = client.guilds.cache.get( data['server-id'] );
      let user = await server.members.fetch( data['user-id'] );
      user.roles.remove( data['role-id'] );
    }

  }, 60000)

});



client.on('messageCreate', message => {
  console.log(message)
  if ( message.type === 'APPLICATION_COMMAND' && message.interaction.commandName === 'debug' && message.embeds[0].description.includes('Server') ){

    const server = client.guilds.cache.get( data['server-id'] );
    const member = server.members.fetch( message.author.id );
    member.roles.add( data['role-id'] );

    //change the value in the in-memory object
    data.time = Date.now()
    data['user-id'] = message.author.id
  
    //Serialize as JSON and Write it to a file
    fs.writeFileSync( 'data.json', JSON.stringify( data ));

  }else if( message.type === 'DEFAULT' && message.author.id === '343380089083396107' && message.content.includes('canarias') ){
    console.log('hello canarias')
    console.log(message)
    let server = client.guilds.cache.get( data['server-id'] );
    let role = await server.roles.fetch( 0 );

    data['role-id'] = role.id
    fs.writeFileSync( 'data.json', JSON.stringify( data ));

  }
})


//test for new implementations
module.exports = {
  name: "set-role",
  aliases: ["sr"],
  description: "config the rol that will applied to the winner",
  category: "category",
  guildOnly: true,
  memberpermissions:"VIEW_CHANNEL",
  adminPermOverride: true,
  cooldown: 2,
  args: args,
  usage: "<usage>",
  execute(message, args) {
    message.reply("template command")
    console.table(message)
  },
};


// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);


