var express = require("express");
var app = express();
const path = require("path");

// RUNNING ORDER
// 1. Browser POSTs a file to an express API
// 2. Express saves the file to the disk, ideally in a temporary folder
// 3. Express API runs `child_process.exec` for the command `python myscript.py /path/to/filename`
// 4. Express app loads file from disk based on the CLI argument, and when it's done, it writes the result to stdout in JSON
// 5. The python script finishes and node calls the callback to the exec call and passes in the output string from the python file
// 6. Express parses the JSON, sends the data back.
// 7. Express deletes the temp file

// Decode Form URL Encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Require the upload middleware
const upload = require("./upload");

// Set up a route for file uploads
app.post("/upload", upload.single("fileUpload"), (req, res) => {
  // Handle the uploaded file
  res.json({ message: "File uploaded successfully!" });
});

// function runTranscription() {}

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
