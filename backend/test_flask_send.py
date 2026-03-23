import io
from flask import Flask, send_file
from gtts import gTTS
import threading
import urllib.request
import time

app = Flask(__name__)

@app.route('/test')
def test():
    fp = io.BytesIO()
    gTTS('hello').write_to_fp(fp)
    fp.seek(0)
    return send_file(fp, mimetype='audio/mpeg')

def run_server():
    app.run(port=5005)

if __name__ == '__main__':
    threading.Thread(target=run_server, daemon=True).start()
    time.sleep(2)
    try:
        r = urllib.request.urlopen("http://127.0.0.1:5005/test")
        print("Status", r.status, len(r.read()))
    except Exception as e:
        print("Error", e)
