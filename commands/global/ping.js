const { SlashCommandBuilder, ApplicationIntegrationType} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Use to test if online.")
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
        
	async execute(interaction) {
		await interaction.reply("Pong!");
	},
};