import requests
from flask import Flask

app = Flask(__name__)


@app.route("/")
def home():
    return "<p>Hello, World!</p>"


@app.route("/transcribe", methods=["POST"])
def transcribe():
    if requests.method == "POST":
        length = requests.content_length
        content_type = request.content_type
        data = requests.data
        return "<p>This route will accept an audio file, run transcription logic, and return a string."
    elif requests.method == "GET":
        return "get method received"


@app.route("/summarise", methods=["POST"])
def summarise():
    return "<p>This route will accept a string and run it theough an LLM for summarisation. It will then return a string containing the transcript and summary."
