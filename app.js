import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Require the upload middleware
import upload from "./upload.js";

// Decode Form URL Encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup transcription function that will run the python script
async function runTranscriptionExec(filename) {
  const transcriptionProcessResult = await promisify(exec)(
    `python script.py ${filename}`
  );

  if (transcriptionProcessResult.stderr) {
    console.log(`The transcription script failed to run. See error below
    
    ${transcriptionProcessResult.stderr}`);
    process.exit(1);
  }

  try {
    const transcriptionOutput = JSON.parse(transcriptionProcessResult.stdout);
    return transcriptionOutput;
  } catch (e) {
    console.log(`failed to parse output of transcription script. Output below:
    
    ${transcriptionProcessResult.stdout}`);
    process.exit(1);
  }
}

// Set up a route for file uploads
app.post("/upload", upload, async (req, res) => {
  // Handle the uploaded file
  const uploadedFilename = req.file.filename;

  // Run transcription on uploaded file
  const output = await runTranscriptionExec(uploadedFilename);
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
