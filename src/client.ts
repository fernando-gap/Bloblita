import { Client, GatewayIntentBits, Events, ChatInputCommandInteraction } from "discord.js";
import { token, devGuildId } from "./config/config.json";
import { Connection, ConnectionDevelopment, ConnectionProduction } from "./database/connection";
import Bot from "./bot";

interface ChatInputCommandInteractionBot extends ChatInputCommandInteraction {
    bot: Bot;
}

let database: Connection;

if (process.env["NODE_ENV"] === "development") {
    database = new ConnectionDevelopment();
} else if (process.env["NODE_ENV"] === "production") {
    database = new ConnectionProduction();
} else {
    throw new Error("NODE_ENV envrinoment not set or set incorrectly.");
}

const client =  new Client({ intents: [GatewayIntentBits.Guilds] });
const bot = new Bot(client, database);

bot.client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

bot.client.on(Events.InteractionCreate, async originalInteraction => {
    if (originalInteraction.isChatInputCommand()) {
        const interaction = originalInteraction as ChatInputCommandInteractionBot;
        const command = bot.config.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            if (devGuildId === interaction.guildId && process.env["NODE_ENV"] !== "development") {
                const devdatabase = new ConnectionDevelopment(); /* not cached */
                const devbot = new Bot(client, devdatabase);
                devbot.config = bot.config;
                interaction.bot = devbot;
            } else {
                interaction.bot = bot;
            }

            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }

});

(async () => {
    await bot.init();
    await bot.client.login(token);
})();