import os, json
import glob
import argparse
from pydub import AudioSegment

parser = argparse.ArgumentParser()
parser.add_argument("filename")
args = parser.parse_args()
fileName = args.filename

output = {"filename": "", "og_file_length_sec": 0, "transcript": "", "chunks": 0}

output["filename"] = fileName

# Create folder
UploadsFolder = os.path.exists("uploads")
transcripts = os.path.exists("transcripts")
ChunksFolder = os.path.exists("chunks")
if not UploadsFolder:
    os.mkdir("uploads")
if not transcripts:
    os.mkdir("transcripts")
if not ChunksFolder:
    os.mkdir("chunks")


def deleteAllInFolder(path):
    files = glob.glob(f"{path}")
    for f in files:
        os.remove(f)


def transcribeAudioChunk(filename):
    lang = "en"
    model = whisper.load_model("base")

    # Load audio
    audio = whisper.load_audio(f"chunks/{filename}")
    audio = whisper.pad_or_trim(audio)

    mel = whisper.log_mel_spectrogram(audio).to(model.device)

    # Output the recognized text
    options = whisper.DecodingOptions(
        language=lang, without_timestamps=True, fp16=False
    )
    result = whisper.decode(model, mel, options)
    # print(result.text)

    return result.text


# Chunking audio file
# Load the large audio file
audio = AudioSegment.from_file(f"uploads/{fileName}")
output["og_file_length_sec"] = len(audio) / 1000
# print("Length of original audio is ", len(audio) / 1000, " seconds")

# Define the chunk length (e.g., 30 seconds)
chunk_length = 29 * 1000  # in milliseconds

# Break down the audio file into chunks
chunks = [audio[i : i + chunk_length] for i in range(0, len(audio), chunk_length)]
output["chunks"] = len(chunks)


import whisper

transcriptFileName = f"{fileName}-transcript.txt"

# Save each chunk as a separate file, transcribe it, and write to file
for i, chunk in enumerate(chunks):
    chunk.export(f"chunks/{i}.mp3", format="mp3")
    # Write into a text file
    # print(f"Writing chunk {i}")
    with open(f"transcripts/{transcriptFileName}", "a+") as f:
        f.write(transcribeAudioChunk(f"{i}.mp3") + "\n")

with open(f"transcripts/{fileName}-transcript.txt", "r") as f:
    output["transcript"] = f.read()

print(json.dumps(output))


deleteAllInFolder("chunks/*")
deleteAllInFolder("uploads/*")
