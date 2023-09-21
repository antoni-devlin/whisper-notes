import os
from pydub import AudioSegment
import whisper
import glob

fileName = "policevisit.m4a"

# Add folders
ContentFolder = os.path.exists("content")
DownLoadFolder = os.path.exists("download")
ChunksFolder = os.path.exists("chunks")
if not ContentFolder:
  os.mkdir("content")
if not DownLoadFolder:
  os.mkdir("download")
if not ChunksFolder:
  os.mkdir("chunks")

def deleteAllInFolder(path):
  files = glob.glob(f'{path}')
  for f in files:
    os.remove(f)

# Chunking audio file

# Load the large audio file
audio = AudioSegment.from_file(f"content/{fileName}")

print("Length of original audio is ",len(audio)/1000, " seconds")

# Define the chunk length (e.g., 30 seconds)
chunk_length = 29 * 1000 # in milliseconds

# Break down the audio file into chunks
chunks = [audio[i:i + chunk_length] for i in range(0, len(audio), chunk_length)]

# Save each chunk as a separate file
for i, chunk in enumerate(chunks):
    chunk.export(f"chunks/{i}.mp3", format="mp3")

print(f"Successfully split the audio file into {len(chunks)} chunks.")

clips = next(os.walk("chunks"), (None, None, []))[2]  # [] if no file
clips = [int(x) for x in clips]
print(sorted(clips))

lang = "en"
model = whisper.load_model("base")

for clip in clips:
  # Load audio
  audio = whisper.load_audio(f"chunks/{clip}")
  audio = whisper.pad_or_trim(audio)

  mel = whisper.log_mel_spectrogram(audio).to(model.device)

  # Output the recognized text
  options = whisper.DecodingOptions(language=lang, without_timestamps=True)
  result = whisper.decode(model, mel, options)
  print(result.text)

  # Write into a text file
  with open(f"download/{fileName}.txt", "a+") as f:
    f.write(f"▼ Transcription of {fileName}\n")
    f.write(result.text)

deleteAllInFolder("chunks/*")