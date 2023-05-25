const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { inspect } = require('util');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('[Developers] Use para testar um comando (Somente Desenvolvedores)')
    .addStringOption(option =>
      option.setName('code')
        .setDescription('O código para testar')
        .setRequired(true)),
  async execute(interaction, client) {
    if (interaction.user.id != require('../../config.json').ownerID) return interaction.reply({ content: `Somente meu desenvolvedor pode usar esse comando!`, ephemeral: true })
    const code = interaction.options.getString('code');

    try {
      let saida = eval(code);

      let embed = new Discord.MessageEmbed()
        .setTitle('Sucesso.')
        .addField('Tipo:', `\`\`\`prolog\n${typeof (saida)}\`\`\``, true)
        .addField(':inbox_tray:Entrada:', `\`\`\`js\n${code}\`\`\``)
        .addField(':outbox_tray:Saida:', `\`\`\`js\n${inspect(saida, { depth: 0 }).length >= 1024 ? 'A saída tem um número de caractéres maior que 1024, eu não consigo enviar' : inspect(saida, { depth: 0 })}\`\`\``)
        .setColor('GREEN')
      interaction.reply({ embeds: [embed] })
    } catch (err) {
      let embedfalha = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle(`Erro.`)
        .addField('Entrada:', `\`\`\`${code}\`\`\``)
        .addField('Saida:', `\`\`\`${err}\`\`\``)
      interaction.reply({ embeds: [embedfalha] })
    }
  }
}