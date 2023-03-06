const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Send a funny meme!"),
  async execute(interaction) {
    let embed;
    await axios
      .get("https://www.reddit.com/r/memes/random/.json")
      .then((response) => {
        const [list] = response.data;
        const [post] = list.data.children;
        const permalink = post.data.permalink;
        const memeUrl = `https://reddit.com${permalink}`;
        const memeImage = post.data.url;
        const memeTitle = post.data.title;
        const memeUpVotes = post.data.ups;
        const memeNumComments = post.data.num_comments;

        embed = new EmbedBuilder()
          .setTitle(`${memeTitle}`)
          .setURL(`${memeUrl}`)
          .setColor(`Green`)
          .setImage(`${memeImage}`)
          .setFooter({text: `👍 ${memeUpVotes} 💬 ${memeNumComments}`});
      });
    await interaction.reply({ embeds: [embed] });
  },
};
