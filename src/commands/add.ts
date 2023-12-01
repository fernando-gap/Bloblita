import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Add a word to the Bloblish dictionary.")
        .addStringOption(option => 
            option.setName("bloblish")
                .setDescription("Bloblish headword.")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("english")
                .setDescription("English word equivalent.")
                .setRequired(true)),
    execute: async (interaction) => {
        await interaction.reply("Currently being Implemented.");
    }
}