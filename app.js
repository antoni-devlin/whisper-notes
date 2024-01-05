import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Require the upload middleware
import upload from "./upload.js";

// Decode Form URL Encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup transcription function that will run the python script
async function runTranscription(filename) {
  // spawn new child process to call the python script
  const python = spawn("python", ["script.py", filename]);

  python.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  // Async Iteration available since Node 10
  for await (const data of python.stdout) {
    return JSON.parse(`${data}`);
  }

  python.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

// Set up a route for file uploads
app.post("/upload", upload, async (req, res) => {
  // Handle the uploaded file
  const uploadedFilename = req.file.filename;

  // Run transcription on uploaded file
  const output = await runTranscription(uploadedFilename); // This is where I'm having issues. I'm not sure how to get the output of my python script.
  // console.log(output);
  return res.send(output);
});

// Home route, renders form
app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "/index.html"));
});

// Setup app to run on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
