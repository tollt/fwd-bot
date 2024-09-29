const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("node:fs");

const DICTIONARIES = {
    "FWD" : fs.readFileSync('./dictionaries/fwd.txt', 'utf8'),
    "EA" : fs.readFileSync('./dictionaries/ea.txt', 'utf8'),
    "WB" : fs.readFileSync('./dictionaries/wb.txt', 'utf8'),
    "BP" : fs.readFileSync('./dictionaries/bp.txt', 'utf8')
};

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("solve")
		.setDescription("Solves a (regex) prompt in whichever dictionary.")
        .addStringOption(option =>
            option.setName("prompt")
            .setRequired(true)
            .setDescription("The (regex) prompt")
        )
        .addStringOption(option =>
            option.setName("dictionary")
            .setDescription("The dictionary you wish to use - default: FWD")
            .addChoices(
                {name: "FWD", value: "FWD"},
                {name: "EA", value: "EA"},
                {name: "WB", value: "WB"},
                {name: "BP", value: "BP"},
            )
        )
        .addBooleanOption(option =>
            option.setName("visible")
            .setDescription("false: private, true: public - default: false")
        )
        ,

	async execute(interaction) {
		const prompt = interaction.options.getString("prompt");
        const dictionary = interaction.options.getString("dictionary") ?? "FWD";
        const visible = interaction.options.getBoolean("visible") ?? false;
        const usable = DICTIONARIES[dictionary].match(new RegExp(`[\\S]*${prompt}[\\S]*`, "gm"));
        const words = shuffleArray(usable)
        if (words.length < 1) {
            await interaction.reply(`No words matching ${prompt} (in ${dictionary})`)
        } 
        const wordEmbed = new EmbedBuilder()
            .setTitle(`Words matching ${prompt} (in ${dictionary})`)
            .setDescription(
                `**${words[0] + "\n"}${words[1] ? words[1] + "\n" : ""}${words[2] ? words[2] + "\n" : ""}${words[3] ? words[3] + "\n" : ""}**`
            )
            .setFooter({"text":`This prompt has ${usable.length} results`})
        await interaction.reply({embeds: [wordEmbed], ephemeral: !visible})
	},
};