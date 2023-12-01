import { Sequelize } from "sequelize-typescript";
import data from "../../database.js";
import * as path from "node:path";

export interface Connection {
    driver: unknown;
    check(): any;
    init(): any;
}

abstract class ConnectionDatabase {
    driver: Sequelize;
    modelsPath: string;

    constructor() {
        this.modelsPath = path.resolve("./models/**/*.js");
    }
}

export class ConnectionDevelopment extends ConnectionDatabase implements Connection {
    init(): void {
        const config = data["development"];
        config.models = [this.modelsPath];
        this.driver = new Sequelize(config.database, config.username, config.password, config);
    }
    
    async check(): Promise<boolean> {
        try {
            await this.driver.authenticate();
            return true;
        } catch (error) {
            console.log("Unable to check database connection", error);
            return false;
        }
    }
}

export class ConnectionProduction extends ConnectionDatabase implements Connection {
    init(): void {
        const config = data["production"];
        config.models = [this.modelsPath];
        this.driver = new Sequelize(config.database, config.username, config.password, config);
    }

    async check(): Promise<boolean> {
        try {
            await this.driver.authenticate();
            return true;
        } catch (error) {
            console.log("Unable to check database connection", error);
            return false;
        }
    }
}
