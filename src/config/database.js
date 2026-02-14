import mongoose from 'mongoose' 
import dotenv from 'dotenv'

dotenv.config({path: '../../.env'});

const connectDB = async () => await mongoose.connect(process.env.DATABASE_CONNECTION_STRING);

export default connectDB;