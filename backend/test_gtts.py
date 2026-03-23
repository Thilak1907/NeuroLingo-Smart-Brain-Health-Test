import sys
import traceback
from gtts import gTTS

def run():
    try:
        print("Testing te")
        tts = gTTS(text="[IndicBert తెలుగు] Hello", lang='te')
        tts.save("test_te.mp3")
        print("TE successful")
    except Exception as e:
        print("TE failed:")
        traceback.print_exc()

    try:
        print("Testing hi")
        tts = gTTS(text="[IndicBert हिंदी] Hello", lang='hi')
        tts.save("test_hi.mp3")
        print("HI successful")
    except Exception as e:
        print("HI failed:")
        traceback.print_exc()

if __name__ == "__main__":
    run()
