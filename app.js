import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Require the upload middleware
import upload from "./upload.js";

// Decode Form URL Encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup transcription function that will run the python script
function runTranscription(filename, res) {
  console.log(
    `Spawning childprocess and running transcription script on ${filename}`
  );
  const ls = spawn("python", ["script.py", filename]);

  ls.stdout.on("data", (data) => {
    let py_response = JSON.parse(data); // #'data' is now a JSON object. How do I process it so I can pull out individual keys in the /upload route?
    return py_response;
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
app.post("/upload", upload, (req, res) => {
  // Handle the uploaded file
  const uploadedFilename = req.file.filename;

  // Run transcription on uploaded file
  const output = runTranscription(uploadedFilename, res); // This is where I'm having issues. I'm not sure how to get the output of my python script.
  console.log(output);
  res.send(output);
});

// Home route, renders form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// Setup app to run on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
