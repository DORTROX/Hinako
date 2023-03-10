const { SlashCommandBuilder } = require("discord.js");
const MongoClient = require('mongodb').MongoClient;

async function generateSelectMenuOptions(interaction) {
  const selectMenuOptions = [];
  const client = await MongoClient.connect(process.env.mongodburi, { useUnifiedTopology: true });
  const dbo = client.db("Hinako");

  const pipeline = [
    {
      $match: {
        creatorID: interaction.member.id
      }
    },
    {
      $group: {
        _id: '$creatorID',
        names: { $push: '$TemplateName' }
      }
    }
  ];

  const result = await dbo.collection('hinakodiscords').aggregate(pipeline).toArray();

  result.forEach((group) => {
    group.names.forEach((name) => {
      selectMenuOptions.push({
        name: name,
        value: name,
      });
    });
  });

  return selectMenuOptions;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("load_server_backup")
    .setDescription("Loads the clone of a server where command is used")
    .addStringOption(option =>
        option.setName('category')
            .setDescription('The gif category')
            .setRequired(true)
            .addChoices()),
  async execute(interaction) {
    const selectMenuOptions = await generateSelectMenuOptions(interaction);
    interaction.options.getString('backup_name');
  },
};
