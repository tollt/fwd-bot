const { SlashCommandBuilder} = require("discord.js");
require("dotenv").config()
const fs = require("node:fs");

const FWD = "dictionaries/fwd.txt"
const CHANNEL = process.env.FWD_CHANNEL
module.exports = {
	data: new SlashCommandBuilder()
		.setName("fwd")
		.setDescription("Fake Word Dictionary")
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
            let dict = fs.readFileSync(FWD, "utf8")
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
                    invalidWordsCount++
                }
            }
            fs.writeFileSync(FWD, dict)
            await interaction.reply({content:`${invalidWords ? "invalid " + invalidWords : `Added ${words.length - invalidWordsCount} words`}`, ephemeral: true})
            await interaction.client.channels.cache.get(CHANNEL).send(interaction.member.user.username + " ADDED\n" + wrote)
        }
        else if (interaction.options.getSubcommand() === "remove-word") {
            const words = interaction.options.getString("words").toLowerCase().replace(/\s/g, "\n").split("\n")
            let dict = fs.readFileSync(FWD, "utf8")
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
                    invalidWordsCount++
                }
            }
            fs.writeFileSync(FWD, dict)
            await interaction.reply({content:`${invalidWords ? "invalid " + invalidWords : ""} Removed ${words.length - invalidWordsCount} words`, ephemeral: true})
            await interaction.client.channels.cache.get(CHANNEL).send(interaction.member.user.username + " REMOVED\n" + wrote)
        }
	},
};