import OpenAI from "openai";
import fs from "fs";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

async function transcribe(audioFolder, fileName) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(`${audioFolder}/${fileName}`),
    model: "whisper-1",
  });

  console.log(transcription.text);
}

transcribe("uploads", "obama.mp3");
