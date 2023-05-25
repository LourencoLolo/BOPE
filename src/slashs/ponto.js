const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ponto')
        .setDescription('[Apenas o Coronel] Crie a mensagem de bate-ponto!'),
    async execute(interaction, client) {
        if (interaction.user.id != require('../../config.json').ownerID) return interaction.reply({ content: `Somente meu desenvolvedor pode usar esse comando!`, ephemeral: true })

        let e = {
            title: 'Bate-ponto',
            description: `Para iniciar o Bate-ponto clique no Botão 'Iniciar BP'
            Para finalizar o Bate-ponto clique no botão 'Finalizar BP'`,
            color: client.color
        }
        const botao1 = new Discord.MessageActionRow()
        .addComponents([
            new Discord.MessageButton()
            .setCustomId('iniciarbp')
            .setLabel('Iniciar BP')
            .setStyle('SUCCESS')
        ], [
            new Discord.MessageButton()
            .setCustomId('finalizarbp')
            .setLabel('Finalizar BP')
            .setStyle('DANGER')
        ])

      await interaction.reply({embeds: [e], components: [botao1]})
    }
}