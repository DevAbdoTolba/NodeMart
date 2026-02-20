import dotenv from 'dotenv'
import app from './app.js'
import connectDB from './config/database.js'

dotenv.config({ path: './.env' });
connectDB();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
