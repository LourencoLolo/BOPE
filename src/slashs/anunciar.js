const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anunciar')
        .setDescription('[Apenas o Coronel] Faça um anuncio!')
        .addStringOption(option =>
            option.setName('texto')
              .setDescription('O texto do anuncio')
              .setRequired(true)),
    async execute(interaction, client) {
        const texto = interaction.options.getString('texto');
        
        let e = {
            title: 'Anuncio',
            description: `${texto}
            
            Anunciado por: ${interaction.user}`,
            color: client.color
        }

        interaction.reply({embeds: [e]})
    }
}