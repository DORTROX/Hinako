const { SlashCommandBuilder, EmbedBuilder, bold } = require("discord.js");
const Backup = require("discord-backup");
const { MongoClient } = require('mongodb');
const GuildTemplate = require("../../../schemas/Guild/GuildBackupSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guild_backup_create")
    .setDescription("Creates the Currect Clone"),
  async execute(interaction) {
    console.log('Working')
    let Notification = new EmbedBuilder()
        .setColor('Cyan')
        .setTitle(bold('Backup Created Successfully :white_check_mark: '))
        .setImage('https://media1.tenor.com/images/b3b66ace65470cba241193b62366dfee/tenor.gif')
    const Guild_Name = interaction.fields.getTextInputValue("GuildName");
    const Description = interaction.fields.getTextInputValue("Description");
    Notification.setDescription(`To load it you can use Guild Name: ${Guild_Name} with our Slash command guild_backup_load.`);

    Backup.create(interaction.guild, {
      jsonBeautify: true,
    }).then((backupData) => {
      MongoClient.connect(
        "mongodb+srv://DORTROX:levis001@cluster0.6zknt.mongodb.net/Hinako",
        function (err, database) {
            console.log('err in 25', err)
          if (err) throw err;
          let DataBaseStorage = database.db("Hinako");
          DataBaseStorage.collection("servertemps").insertOne(
            backupData,
            function (err) {
              if (err) throw err;
            }
          );
          GuildTemplate.countDocuments(
            { id: backupData.id },
            async function (err, count) {
              if (!count) {
                DataBaseStorage.collection("servertemps").updateOne(
                  {},
                  {
                    $set: {
                      creatorID: interaction.member.id,
                      TemplateName: Guild_Name,
                      creatorName: interaction.member.displayName,
                      TemplateDescription: Description,
                    },
                  }
                );
              } else {
                DataBaseStorage.collection("servertemps").findOneAndUpdate(
                  { id: backupData.id },
                  {
                    $set: {
                      creatorID: interaction.member.id,
                      TemplateName: Guild_Name,
                      creatorName: interaction.member.displayName,
                      TemplateDescription: Description,
                    },
                  }
                );
              }
            }
          );
        }
      );
    });

    await interaction.followUp({embeds : [Notification]});
  },
};
