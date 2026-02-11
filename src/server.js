const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const app = require('./src/app');

const DB = process.env.DATABASE;
mongoose.connect(DB).then(() => console.log('DB Connection Successful!'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
