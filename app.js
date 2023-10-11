var express = require("express");
var app = express();
const path = require("path");

app.post("/transcribe", (req, res) => {
  console.log(req);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
