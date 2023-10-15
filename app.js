var express = require("express");
var app = express();
const path = require("path");

// Decode Form URL Encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Transcribe post route
app.post("/transcribe", (req, res, next) => {
  // const form_data = req.body["fname"];
  const form_data = req.body;
  res.send(form_data);

  // const spawn = require("child_process").spawn;
  // const ls = spawn("python", ["reverse.py", form_data]);

  // ls.stdout.on("data", (data) => {
  //   res.send(`stdout: ${data}`);
  // });

  // ls.stderr.on("data", (data) => {
  //   console.log(`stderr: ${data}`);
  // });

  // ls.on("close", (code) => {
  //   console.log(`child process exited with code ${code}`);
  // });
});

// Home route, contains form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// Setup app to run on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
