const Discord = require("discord.js");
const {
  REST,
  Routes,
  Client,
  Collection,
  MessageAttachment,
  Events,
  GatewayIntentBits,
} = require("discord.js");
const path = require("node:path");
const mongoose = require('mongoose')

const Interaction = require('./handlers/InteractionHandler')
const CommandLoader  = require('./handlers/CommandsLoader')

require("dotenv").config();

mongoose.connect(process.env.mongodburi, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((m) => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

const Dortrox = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMessages,
  ],
});

Dortrox.commands = new Discord.Collection();

const CommandPath = path.join(__dirname, 'commands');
const commandsArray = CommandLoader(CommandPath, Dortrox.commands);

const rest = new REST({ version: '10' }).setToken(process.env.token);


(async () => {
	try {
		console.log(`Started refreshing ${commandsArray.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.clientId),
			{ body: commandsArray },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {

		console.error(error);
	}
})();

Dortrox.once(Events.ClientReady, (c) => {
  console.log(`Logged In As ${c.user.tag}`);
});

Dortrox.on(Events.InteractionCreate, async (interaction) => {
  console.log(interaction.member.displayName)
  console.log(interaction.user.id)
  try {
  await Interaction(interaction, Dortrox)
  } catch(error) {
    console.log(error)
  }
});

Dortrox.login(process.env.token);
