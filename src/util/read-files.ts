import * as path from "node:path";
import * as fs from "node:fs";

declare type fileprocess = (absPath: string, dirname: string) => void;

export default (dirname: string, callback: fileprocess) => {
    if (!path.isAbsolute(dirname)) {
        dirname = path.resolve(__dirname, dirname);
    }

    fs.readdir(dirname, { recursive: true }, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            callback(`${dirname}/${file}`, dirname);
        }
    });
}