require('dotenv').config()
const {Pool} = require('pg');
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let response,data

db.query('SELECT row_to_json(c2me) FROM c2me;', (err, res) => {
  if (err) {
    console.log(err);
  }
  else{
    console.log(res.rows[0].row_to_json);
    response = res.rows[0].row_to_json
    data = JSON.parse( JSON.stringify( response ));
    console.log(typeof data, data);
  }
});


// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');

  setInterval(() => {

    if (data.user_id && (Date.now() - data.time) >= (2 * 60 * 60 * 1000)) {
      client.guilds.fetch(data.server_id)
        .then(
          server =>
            server.members.fetch(data.user_id)
              .then(
                user => user.roles.remove(data.role_id)
              )
        )

    }

  }, 60000)

});



client.on('messageCreate', message => {
  console.log(message)
  if (message.type === 'APPLICATION_COMMAND' && message.interaction.commandName === 'bump' && message.embeds[0].description.includes('done')) {

    client.guilds.fetch(data.server_id)
      .then(
        function (guild) {
          guild.members.fetch(message.interaction.user.id)
            .then(
              function (member) {
                member.roles.add(data.role_id)
              }
            )
        }
      ).catch(console.error)


    //change the value in the in-memory object
    data.time = Date.now()
    data.user_id = message.interaction.user.id

    //Serialize as JSON and Write it to a file
    db.query('UPDATE c2me SET user_id = $1, time = $2 where server_id = $3', [data.user_id, data.time, data.server_id], (err, res) => {
      if (err) {
        console.log(err);
      }
    });

  } else if (message.type === 'DEFAULT' && message.author.id === '343380089083396107' && message.content.includes('cfgrole')) {
    console.log('configurando rol')

    let tempRolId = message.mentions.roles.keys().next().value

    console.log(tempRolId, data)

    data.role_id = tempRolId
    console.log(data)
    db.query('UPDATE c2me SET role_id = $1 where server_id = $2', [data.user_id, data.server_id], (err, res) => {
      if (err) {
        console.log(err);
      }
    });

  }
})


// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);


