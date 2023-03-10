const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, bold } = require("discord.js");

module.exports = { 
    data: new SlashCommandBuilder()
    .setName('create_server_backup')
    .setDescription('Creates a clone of the server where command is used'),
    async execute ( interaction ) {
        let MissingPerms = new EmbedBuilder()
        .setColor('Red')
        .setTitle(bold('Missing Permission ❌'))
        .setDescription('You need Adminsitrator Permission to use this command.')
        .setImage('https://media1.tenor.com/images/b3b66ace65470cba241193b62366dfee/tenor.gif')

        if (!interaction.memberPermissions.has('Administrator')) return await interaction.reply({embeds: [MissingPerms]})

        try {
        const modal = new ModalBuilder()
			.setCustomId('hidden_guild_backup_create')
			.setTitle('Guild Backup Application');
		const Guild_Name = new TextInputBuilder()
			.setCustomId('GuildName')
			.setLabel("Name for your Guild Backup")
			.setStyle(TextInputStyle.Short);

		const Description = new TextInputBuilder()
			.setCustomId('Description')
			.setLabel("Describe your Guild")
			.setStyle(TextInputStyle.Paragraph);
		const firstActionRow = new ActionRowBuilder().addComponents(Guild_Name);
		const secondActionRow = new ActionRowBuilder().addComponents(Description);

		modal.addComponents(firstActionRow, secondActionRow);
        await interaction.showModal(modal)
        } catch (error) {
            throw error
        }
    }
};