import express from "express";
// var express = require("express");
const app = express();
// const path = require("path");
import path from "path";
// import {once} from events

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Require the upload middleware
import upload from "./upload.js";
// const upload = require("./upload");

// Decode Form URL Encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { spawn } from "node:child_process";

// Setup transcription function that will run the python script
function runTranscription(filename, res) {
  // const filePath = `uploads/${filename}`;
  console.log("Spawning child process!");
  // const spawn = require("child_process").spawn;

  console.log(`Running transcription script on ${filename}`);
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
  const output = runTranscription(uploadedFilename, res);
  console.log(output);
  res.send(output);
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
