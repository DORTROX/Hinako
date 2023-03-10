const { SlashCommandBuilder, EmbedBuilder, bold } = require("discord.js");
const Backup = require("discord-backup");
MongoClient = require('mongodb').MongoClient;
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hidden_guild_backup_create")
    .setDescription("Creates a backup of the current guild.")
    .setDefaultMemberPermissions(0),
  async execute(interaction) {  
    const Guild_Name = interaction.fields.getTextInputValue("GuildName");
    const Description = interaction.fields.getTextInputValue("Description");  

    const Notification = new EmbedBuilder()
      .setColor("CYAN")
      .setImage(
        "https://media1.tenor.com/images/b3b66ace65470cba241193b62366dfee/tenor.gif"
      )
      .setDescription(
        `To load it, use the guild name: ${Guild_Name} with the \`/guild_backup_load\` command.`
      );
      
    try {
      Backup
        .create(interaction.guild, {
          jsonBeautify: true,
          saveImages: "base64",
        })
        .then((backupData) => {
          MongoClient.connect(
            process.env.mongodburi,
            function (err, db) {
              if (err) throw err;
              var dbo = db.db("Hinako");
              dbo.collection("hinakodiscords").countDocuments(
                { TemplateName: Guild_Name },
                async function (err, count) {
                  if (count === 0) {
                    Notification.setTitle(bold("Backup created successfully :white_check_mark:"))
                    Notification.setDescription(
                      `To load it, use the guild name: ${Guild_Name} with the \`/guild_backup_load\` command.`
                    );
                    dbo.collection("hinakodiscords").insertOne({
                      TemplateName: Guild_Name,
                      TemplateDescription: Description,
                      creatorName: interaction.member.displayName,
                      creatorID: interaction.member.id,
                      verificationLevel: backupData.verificationLevel,
                      explicitContentFilter: backupData.explicitContentFilter,
                      defaultMessageNotifications: backupData.defaultMessageNotifications,
                      widget: backupData.widget,
                      channels: backupData.channels,
                      roles: backupData.roles,
                      bans: backupData.bans,
                      emojis: backupData.emojis,
                      members: backupData.members,
                      createdTimestamp: backupData.createdTimestamp,
                      guildId: backupData.guildID,
                      iconURL: backupData.iconURL,
                    }, function (err, res) {
                      if (err) throw err;
                    });
                  } else 
                   {
                    Notification.setTitle(bold("Backup Updated successfully :white_check_mark:"))
                    dbo
                    .collection("hinakodiscords")
                    .findOneAndUpdate(
                      {},
                      {
                        $set: {
                          TemplateName: Guild_Name,
                          TemplateDescription: Description,
                          creatorName: interaction.member.displayName,
                          creatorID: interaction.member.id,
                          verificationLevel: backupData.verificationLevel,
                          explicitContentFilter: backupData.explicitContentFilter,
                          defaultMessageNotifications: backupData.defaultMessageNotifications,
                          widget: backupData.widget,
                          channels: backupData.channels,
                          roles: backupData.roles,
                          bans: backupData.bans,
                          emojis: backupData.emojis,
                          members: backupData.members,
                          createdTimestamp: backupData.createdTimestamp,
                          guildId: backupData.guildID,
                          iconURL: backupData.iconURL,
                        },
                      }
                    );
                   }
                }
              );
              interaction.followUp({embeds : [Notification]}); // move response here
            }
          )
        });
    } catch (err) {
      console.log(err);
    }
  },
};
