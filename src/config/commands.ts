import { REST, Routes } from "discord.js";
import { token, clientId } from "./config.json";

const rest = new REST().setToken(token);

export default async function() {
    return await rest.get(Routes.applicationCommands(clientId));
}