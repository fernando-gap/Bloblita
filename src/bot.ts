import { Client, Collection } from "discord.js";
import { Connection } from "./database/connection"
import commands from "./config/commands.js";
import readFile from "./util/read-files";

interface Command {
    id: string;
    name: string;
    data: string;
    execute: Function;
}

export default class Bot {
    public client: Client;
    private database: Connection;
    public config: {
        commands: Collection<string, Command>;
    };

    constructor(client: Client, database: Connection) {
        this.client = client;
        this.database = database;
        this.config = {
            commands: new Collection<string, Command>()
        }
    }

    async init() {
        await this.setupConfiguration();
    }

    async getDatabase(): Promise<Connection> {
        if (await this.database.check()) {
            return this.database;
        }
        throw new Error("Unable to get database connection");
    }

    private async setupConfiguration() {
        await this.setupCommands();
    }

    private async setupCommands() {
        const c = await commands();

        if (Array.isArray(c)) {
            for (const command of c) {
                this.config.commands.set(command.name, command)
            }

            readFile("../commands", (path, dirname) => {
                const command = require(path)["default"];
                if ("data" in command && "execute" in command) {
                    const extendConf = { ...this.config.commands.get(command.data.name), ...command};
                    this.config.commands.set(extendConf.name, extendConf);
                }
            })
            console.log(this.config.commands)
        }
    }
}