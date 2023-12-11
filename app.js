var express = require("express");
var app = express();
const path = require("path");
// Require the upload middleware
const upload = require("./upload");

// Decode Form URL Encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup transcription function that will run the python script
function runTranscription(filename, res) {
  // const filePath = `uploads/${filename}`;
  console.log("Spawning child process!");
  const spawn = require("child_process").spawn;

  console.log(`Running transcription script on ${filename}`);
  const ls = spawn("python", ["script.py", filename]);

  ls.stdout.on("data", (data) => {
    // res.send(`stdout: ${data}`); #This is a JSON object. How do I process it so I can pull out individual keys in the /upload route?
    return data;
  });

  ls.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
    return data;
  });

  ls.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

// Set up a route for file uploads
app.post("/upload", upload.single("fileUpload"), (req, res) => {
  // Handle the uploaded file
  const uploadedFilename = req.file.filename;

  // Run transcription on uploaded file
  res.send(runTranscription(uploadedFilename, res));
});

// // Transcribe post route
// app.post("/transcribe", (req, res, next) => {
//   const form_data = req.body;
//   res.send(form_data);
// });

// Home route, contains form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// Setup app to run on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
