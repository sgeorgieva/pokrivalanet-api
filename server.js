const app = require("./app");
const dotenv = require("dotenv");
const pc = require("picocolors");

dotenv.config({ path: "./config.env" });

// START THE SERVER
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const server = app
  .listen(port, "216.24.57.252", () => {
    console.log(pc.cyan(`App running on port ${port}...`));
  })
  .on("error", (err) => {
    console.error("MySQL connection failed");
    throw err;
  });
