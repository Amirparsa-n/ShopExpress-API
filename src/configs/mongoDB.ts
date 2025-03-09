import mongoose from 'mongoose';
import { mongoURI } from './config';

export async function connectToMongoDB() {
    try {
        await mongoose.connect(mongoURI as string);
        console.log(`Mongoose Connected: ${mongoose.connection.host}`);
    } catch (err) {
        console.log(`Error in mongoose connection: ${err}`);
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
