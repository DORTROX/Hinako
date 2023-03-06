const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, bold } = require("discord.js");

module.exports = { 
    data: new SlashCommandBuilder()
    .setName('create_server_backup')
    .setDescription('Creates a clone of ther server where command is used'),
    async execute ( interaction ) {
        let MissingPerms = new EmbedBuilder()
        .setColor('Red')
        .setTitle(bold('Missing Permission ❌'))
        .setDescription('You need Adminsitrator Permission to use this command.')
        .setImage('https://media1.tenor.com/images/b3b66ace65470cba241193b62366dfee/tenor.gif')

        if (!interaction.memberPermissions.has('Administrator')) return await interaction.reply({embeds: [MissingPerms]})

        try {
        const modal = new ModalBuilder()
			.setCustomId('guild_backup_create')
			.setTitle('Guild Backup Application');

		// Add components to modal

		// Create the text input components
		const Guild_Name = new TextInputBuilder()
			.setCustomId('GuildName')
		    // The label is the prompt the user sees for this input
			.setLabel("Name for your Guild Backup")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		const Description = new TextInputBuilder()
			.setCustomId('Description')
			.setLabel("Describe your Guild")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(Guild_Name);
		const secondActionRow = new ActionRowBuilder().addComponents(Description);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);
        await interaction.showModal(modal)
        } catch (error) {
            throw error
        }
    }
};