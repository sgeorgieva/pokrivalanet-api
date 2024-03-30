const app = require('./app');
const dotenv = require('dotenv');
const pc = require('picocolors');

dotenv.config({ path: './config.env' });

// START THE SERVER
const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(pc.cyan(`App running on port ${port}...`));
}).on('error', (e) => {
  console.error("MySQL connection failed");
  throw e;
});