const { SlashCommandBuilder} = require("discord.js");
require("dotenv").config()
const fs = require("node:fs");

const EA = "dictionaries/ea.txt"
const CHANNEL = process.env.EA_CHANNEL
module.exports = {
	data: new SlashCommandBuilder()
		.setName("ea")
		.setDescription("Extra Additions")
        .addSubcommand(subcommand =>
            subcommand
            .setName("add-word")
            .setDescription("adds a word to EA")
            .addStringOption(option => 
                option.setName("words")
                .setRequired(true)
                .setDescription("Words to remove"))
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName("remove-word")
            .setDescription("removes a word from EA")
            .addStringOption(option => 
                option.setName("words")
                .setRequired(true)
                .setDescription("Words to remove"))
        )
        ,        
	async execute(interaction) {
        if (!interaction.member.roles.cache.has("936452496774275123")) {
            await interaction.reply({content:"You do not have access.", ephemeral:true})
            return;
        }
        let invalidWords = ""
        let invalidWordsCount = 0
        if (interaction.options.getSubcommand() === "add-word") {
            const words = interaction.options.getString("words").toLowerCase().replace(/\s/g, "\n").split("\n")
            let dict = fs.readFileSync(EA, "utf8")
            let wrote = ""
            for (const word of words)
            {
                if (!word){continue}
                if (!dict.match(new RegExp(`^${word}$`, "gm")))
                {
                    dict += `${word}\n`
                    wrote += `${word}\n`
                } else {
                    invalidWords += `${word}\n`
                }
            }
            fs.writeFileSync(EA, dict)
            await interaction.reply({content:`${invalidWords ? "invalid " + invalidWords : `Added ${words.length - invalidWordsCount} words`}`, ephemeral: true})
            await interaction.client.channels.cache.get(CHANNEL).send(interaction.member.user.username + " ADDED\n" + wrote)
        }
        else if (interaction.options.getSubcommand() === "remove-word") {
            const words = interaction.options.getString("words").toLowerCase().replace(/\w/, "\n").split("\n")
            let dict = fs.readFileSync(EA, "utf8")
            let wrote = ""
            for (const word of words)
            {
                if (!word){continue}
                if (dict.match(new RegExp(`^${word}$`, "gm")))
                {
                    dict = dict.replace(new RegExp(`(?<=\n)${word}\n`, "g"), "")
                    wrote += `${word}\n`
                } else {
                    invalidWords += `${word}\n`
                }
            }
            fs.writeFileSync(EA, dict)
            await interaction.reply({content:`${invalidWords ? "invalid " + invalidWords : ""} Removed ${words.length - invalidWordsCount} words`, ephemeral: true})
            await interaction.client.channels.cache.get(CHANNEL).send(interaction.member.user.username + " REMOVED\n" + wrote)
        }
	},
};