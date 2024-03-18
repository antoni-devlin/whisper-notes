import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { transcribe, summarise } from "./openai_functions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Require the upload middleware
import upload from "./upload.js";

// Decode Form URL Encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up a route for file uploads
app.post("/upload", upload, async (req, res) => {
  // Handle the uploaded file
  const uploadedFilename = req.file.filename;

  const transcript = await transcribe("uploads", uploadedFilename);
  const summary = await summarise(transcript);
  return res.redirect();
});

app.get("/transcribe", (req, res) => {});

// Home route, renders form
app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "/index.html"));
});

// Setup app to run on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
