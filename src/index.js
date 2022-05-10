const fs = require('fs');

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let file_content = fs.readFileSync( __dirname + '/data.json' );
let data = JSON.parse( file_content );


// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');

  setInterval(()=>{

    if( data['user-id'] && ( Date.now() - data.time ) >= ( 2 * 60 * 60 * 1000 ) ) {
      let server = client.guilds.cache.get( data['server-id'] );
      let user = server.members.fetch( data['user-id'] );
      user.roles.remove( data['role-id'] );
    }

  }, 60000)

});



client.on('messageCreate', message => {
  console.log(message)
  if ( message.type === 'APPLICATION_COMMAND' && message.interaction.commandName === 'debug' && message.embeds[0].description.includes('Server') ){

    const server = client.guilds.fetch( data['server-id'] );
    const member = server.members.fetch( message.interaction.user.id );
    member.roles.add( data['role-id'] );

    //change the value in the in-memory object
    data.time = Date.now()
    data['user-id'] = message.interaction.user.id
  
    //Serialize as JSON and Write it to a file
    fs.writeFileSync( __dirname + '/data.json', JSON.stringify( data ));

  }else if( message.type === 'DEFAULT' && message.author.id === '343380089083396107' && message.content.includes('canarias') ){
    console.log('configurando rol')

    let tempRolId = message.mentions.roles.keys().next().value

    console.log(tempRolId)

    data['role-id'] = tempRolId
    fs.writeFileSync( __dirname + '/data.json', JSON.stringify( data ));

  }
})


// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);


