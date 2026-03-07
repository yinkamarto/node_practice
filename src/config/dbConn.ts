import mongoose from 'mongoose';

export async function connectDB() {
    const dbURI: string = process.env.DATABASE_URI || "undefined";
    try {
        return await mongoose.connect(dbURI) || null;
    } catch (err) {
        console.log(err);
    }
}