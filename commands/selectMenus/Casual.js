const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const CommandFetcher = require('../../handlers/CommandsFetcher')
const path = require("node:path");

const CommandPath = path.join(__dirname, "../Casual");
const commandsArray = CommandFetcher(CommandPath);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("casual")
    .setDescription("Casual Command"),
  async execute(interaction) {

      const fields =(commandsArray.map(command => {
        return { name: command[0], value: command[1], inline:true };
      }));
    let embed = new EmbedBuilder()
      .setColor("Aqua")
      .setTitle("Commands Help")
      .setThumbnail('https://cdn0.iconfinder.com/data/icons/cosmo-multimedia/40/terminal-512.png')
      .setDescription('All the Commands for Casual\n')
      .addFields(fields)
      .setImage('https://media1.tenor.com/images/b3b66ace65470cba241193b62366dfee/tenor.gif')
    await interaction.reply({embeds: [embed]});
  },
};
