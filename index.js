const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_PRESENCES
    ]
});
const config = require('./config.json');
const fs = require('fs')
const db = require('quick.db')
const ms = require('parse-ms')

client.db = require('quick.db');
client.color = "#128500";
client.slashs = new Discord.Collection();

const pasta = fs.readdirSync('./src/slashs').filter(file => file.endsWith('.js'));

for (const file of pasta) {
  const slash = require(`./src/slashs/${file}`);
  client.slashs.set(slash.data.name, slash);
}

client.on('ready', async () => {
  let commands = [];
  let commandFile = fs.readdirSync('./src/slashs').filter(file => file.endsWith('.js'));

  for (const file of commandFile) {
    const command = require(`./src/slashs/${file}`);
    commands.push(command.data.toJSON());
  };

  await client.application.commands.set(commands).then(() => console.log(`Slashs carregados.`)).catch((e) => console.log(e));
  console.log('Estou Online!')
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const slash = client.slashs.get(interaction.commandName);

  if (!slash) return;

    try {
      await slash.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Ocorreu um erro ao executar esse comando!', ephemeral: true });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    let author = interaction.user;

    let data2 = Date.now()
    let data = new Date(data2);
    let dia = data.getDate() >= 10 ? data.getDate() : `0${data.getDate()}`;
    let mes = data.getMonth() + 1 >= 10 ? data.getMonth() + 1 : `0${data.getMonth() + 1}`;
    let ano = data.getFullYear();
    let horas_errado = data.setHours(data.getHours() - 3);
    let horas = data.getHours() >= 10 ? data.getHours() : `0${data.getHours()}`;
    let minutos = data.getMinutes() >= 10 ? data.getMinutes() : `0${data.getMinutes()}`;

    // Chat-Logs Bate-ponto
    let log_channel = client.channels.cache.get("1111410512350158900")

    if (interaction.customId == 'iniciarbp') {
        if (!db.get(`bp/${author.id}`)) {
          db.set(`bp/${author.id}`, true)

          if (!db.get(`bp/${author.id}/chat`)) {
            let categ = "1111410440321376307"
            let channel = await interaction.guild.channels.create(`${author.username}`, {type: 'GUILD_TEXT', permissionOverwrites: [{
              id: interaction.guild.id, 
              deny: [Discord.Permissions.FLAGS.VIEW_CHANNEL],
            }, {
              id: interaction.user.id,
              allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL],
            }],
            parent: categ})
            db.set(`bp/${author.id}/chat`, channel.id)
          }

          let bp_channel = client.channels.cache.get(db.get(`bp/${author.id}/chat`))

          let bpembed = {
              title: 'Bate-ponto iniciado',
              description: `**QRA:** <@${author.id}>
              **Data:** ${dia}/${mes}/${ano}
              **Horário:** ${horas}:${minutos}`,
              color: "GREEN"
          }

          db.set(`bp/${interaction.user.id}/tempoinicio`, data2)
          bp_channel.send({embeds: [bpembed]})
          interaction.reply({content: `Você iniciou seu bate-ponto com Sucesso!`, ephemeral: true})
        } else {
          interaction.reply({content: `Você já está batendo ponto!`, ephemeral: true})
        }
    } else if (interaction.customId == 'finalizarbp') {
        if (db.get(`bp/${author.id}`)) {
          db.set(`bp/${author.id}`, false)

          let bp_channel = client.channels.cache.get(db.get(`bp/${author.id}/chat`))
          let total_hoje = Date.now() - db.get(`bp/${interaction.user.id}/tempoinicio`)
          let total = total_hoje + db.get(`bp/${author.id}/total`)

          let bpembed = {
              title: 'Bate-ponto finalizado',
              description: `**QRA:** <@${author.id}>
              **Data:** ${dia}/${mes}/${ano}
              **Horário:** ${horas}:${minutos}
              **Total de hoje:** ${ms(total_hoje).hours >= 10 ? ms(total_hoje).hours : `0${ms(total_hoje).hours}`}:${ms(total_hoje).minutes >= 10 ? ms(total_hoje).minutes : `0${ms(total_hoje).minutes}`}`,
              color: "RED"
          }

          let log_embed = {
              title: 'Um bate-ponto acaba de ser finalizado',
              description: `**Policial:** <@${author.id}>
              **Data:** ${dia}/${mes}/${ano}
              **Total de hoje:** ${ms(total_hoje).hours >= 10 ? ms(total_hoje).hours : `0${ms(total_hoje).hours}`}:${ms(total_hoje).minutes >= 10 ? ms(total_hoje).minutes : `0${ms(total_hoje).minutes}`}

              **Total:** ${ms(total).hours >= 10 ? ms(total).hours : `0${ms(total).hours}`} horas e ${ms(total).minutes >= 10 ? ms(total).minutes : `0${ms(total).minutes}`} minutos`,
              color: "RED"
          }

          bp_channel.send({embeds: [bpembed]})
          log_channel.send({embeds: [log_embed]})
          interaction.reply({content: `Você finalizou seu bate-ponto com Sucesso!`, ephemeral: true})
        } else {
          interaction.reply({content: `Você não está batendo ponto!`, ephemeral: true})
        }
    }
})

client.login(config.token)