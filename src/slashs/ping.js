const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Veja o ping do bot.'),
    async execute(interaction, client) {
        let e = {
            title: ':ping_pong: | Ping',
            description: `**<:discord:830020052069515264> | Discord (WebSocket)**
            **\`[ ${client.ws.ping}ms ]\`**`,
            color: client.color
        }

        interaction.reply({embeds: [e]})
    }
}