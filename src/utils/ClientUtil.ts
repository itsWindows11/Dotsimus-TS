import path from 'node:path';

import { Command } from '../structures/Command';
import { DotsimusClient } from '../structures/DotsimusClient';
import { Event } from '../structures/Event';

export class ClientUtil {
    client: DotsimusClient;

    constructor(client: DotsimusClient) {
        this.client = client;
    }

    async importStructure<T extends Command | Event>(file: string): Promise<T | null> {
        try {
            const filePath = path.resolve(process.cwd(), file);
            const fileURL = new URL('file:///' + filePath);
            const File = (await import(fileURL.href)).default;

            return new File(this.client);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            this.client.logger.error(`${file.split('/').pop()}: ${message}`);

            return null;
        }
    }
}
