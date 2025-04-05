import dotenv from 'dotenv';

import { createApp } from './app';
import { config } from './configs/config';
import { connectToMongoDB, disconnectMongoDB } from './configs/mongoDB';

dotenv.config();

let server: any;

export async function bootstrap() {
    const PORT = config.get('port');
    const app = createApp();

    await connectToMongoDB();

    try {
        server = app.listen(PORT, () => {
            console.info(`
                ###############################################################
                  Server listening on : http://localhost:${PORT} | ${config.get('isProduction') ? 'production' : 'development'}
                ###############################################################
              `);
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            await closeServer();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            await closeServer();
            process.exit(0);
        });

        return server;
    } catch (err) {
        console.error(err);
    }
}

export async function closeServer() {
    if (server) {
        await server.close();
        await disconnectMongoDB();
    }
}

// Only run server if this file is run directly
if (require.main === module) {
    bootstrap().catch((err) => console.error(err));
}
