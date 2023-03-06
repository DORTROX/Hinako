const axios = require("axios");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anime_search")
    .setDescription("Anime Information")
    .addStringOption((option) =>
      option.setName("name").setDescription("The Name of the Anime").setRequired(true).setMaxLength(100)
    ),
  async execute(interaction) {
    let Anime = interaction.options.getString("name") ?? "None Provided";
    let embed;
    await axios.get(`https://kitsu.io/api/edge/anime`, {
        params: {
          'filter[text]': Anime
        },
        headers: {
          'Accept': 'application/vnd.api+json'
        }
      })
        .then(body => {
          embed = new EmbedBuilder()
          .setTitle(body.data.data[0].attributes.titles.en) 
          .setColor("Red")
          .setDescription(body.data.data[0].attributes.synopsis)
          .setThumbnail(body.data.data[0].attributes.posterImage.original)
          .addFields({ name: 'Ratings', value: body.data.data[0].attributes.averageRating, inline: true })
          .addFields({ name: 'TOTAL EPISODES', value: JSON.stringify(body.data.data[0].attributes.episodeCount), inline: true })
        })
        .catch(error => {
          console.error(error);
        });
    await interaction.reply({embeds: [embed]});
  },
};
