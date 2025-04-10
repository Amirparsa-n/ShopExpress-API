import mongoose from 'mongoose';

import { config } from './config';

export async function connectToMongoDB() {
    const mongoURI = config.get('mongoURI');

    try {
        await mongoose.connect(mongoURI);
        console.log(`Mongoose Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.log(`Error in mongoose connection: ${error}`);
        process.exit(1);
    }
}

export async function disconnectMongoDB() {
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
    }
}
