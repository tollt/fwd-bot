const { SlashCommandBuilder} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("fwd")
		.setDescription("Use to test if online.")
        .addSubcommand(subcommand =>
            subcommand
            .setName("add-word")
            .setDescription("adds a word to the FWD")
            .addStringOption(option => 
                option.setName("words")
                .setRequired(true)
                .setDescription("Words to remove"))
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("remove-word")
            .setDescription("removes a word from the FWD")
            .addStringOption(option => 
                option.setName("words")
                .setRequired(true)
                .setDescription("Words to add"))
        )
        ,        
	async execute(interaction) {
        if (!interaction.member.roles.cache.has("936452496774275123")) {
            await interaction.reply({content:"You do not have access.", ephemeral:true})
            return;
        }
        if (interaction.options.getSubcommand() === "add-word") {
            interaction.options.getString("words")
        }
        else if (interaction.options.getSubcommand() === "remove-word") {
            await interaction.reply("IM WROKING ON IT (2)")
        }
	},
};