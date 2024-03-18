import OpenAI from "openai";
import fs from "fs";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function transcribe(audioFolder, fileName) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(`${audioFolder}/${fileName}`),
    model: "whisper-1",
  });

  return transcription.text;
}

export async function summarise(transcript) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Turn this transcribed audio file into notes for me to refer to later: ${transcript}`,
      },
    ],
    model: "gpt-3.5-turbo-0125",
  });

  console.log(completion.choices[0]);
  return completion.choices[0];
}

// async function main() {
//   const transcript = await transcribe("uploads", "obama.mp3");
//   const summary = await summarise(transcript);

//   console.log("===Raw transcript===");
//   console.log(transcript);

//   console.log("===Summary===");
//   console.log(summary.message.content);
// }

// main();
