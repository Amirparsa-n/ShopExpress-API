import { connectToMongoDB } from './configs/mongoDB';
import { createApp } from './app';
import dotenv from 'dotenv';
import { isProduction } from './configs/config';
dotenv.config();

let server: any;

export async function bootstrap() {
    const PORT = process.env.PORT;
    const app = createApp();

    await connectToMongoDB();

    try {
        server = app.listen(PORT, () => {
            console.info(`
                ###############################################################
                  Server listening on : http://localhost:${PORT} | ${isProduction ? 'production' : 'development'}
                ###############################################################
              `);
        });
        return server;
    } catch (err) {
        console.error(err);
    }
}

export async function closeServer() {
    if (server) {
        await server.close();
    }
}

bootstrap();
