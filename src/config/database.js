import mongoose from 'mongoose' 

const connectDB = async () => await mongoose.connect(process.env.DATABASE_CONNECTION_STRING);

export default connectDB;