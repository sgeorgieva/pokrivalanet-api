const app = require("./app");
const dotenv = require("dotenv");
const pc = require("picocolors");

dotenv.config({ path: "./config.env" });

// START THE SERVER
const port = process.env.PORT || 4000;

const server = app
  .listen(port, "0.0.0.0", () => {
    console.log(pc.cyan(`App running on port ${port}...`));
  })
  .on("error", (err) => {
    console.error("MySQL connection failed");
    throw err;
  });
