const { REST, Routes } = require("discord.js");
require("dotenv").config()
const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID
const TEST_GUILD_ID = process.env.TEST_GUILD_ID
const fs = require("node:fs");
const path = require("node:path");

const commands = [];
const globalCommands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
	if (folder === "global") {
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			if ("data" in command && "execute" in command) {
				globalCommands.push(command.data.toJSON());
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
		continue;
	}
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID),
			{ body: commands },
		);

		const globalData = await rest.put(
			Routes.applicationCommands(CLIENT_ID),
			{ body: globalCommands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		console.log(`Successfully reloaded ${globalData.length} global application (/) commands.`);

	} catch (error) {
		console.error(error);
	}
})();