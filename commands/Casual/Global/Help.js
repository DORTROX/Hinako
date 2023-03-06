const { ActionRowBuilder, Events, StringSelectMenuBuilder, SlashCommandBuilder, ApplicationCommand, ApplicationCommandOptionType } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Shows a Guide Page"),
    async execute(interaction){
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder('Choose a Type')
                    .addOptions(
                        {
                            label: 'Casual',
                            description: "All command Commands",
                            value: "casual",
                        },
                        {
                            label: 'Fun',
                            description: "All fun Commands",
                            value: "fun"
                        }
                    )
            )
        await interaction.reply({content: 'Helping', components:[row]})
    }
}