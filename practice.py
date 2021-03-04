import youtube_dl
import json

url = "https://www.youtube.com/watch?v=0tX2ck4Rmzk&list=PLdVLzUkC2gsRQki0ZnilX7FIz1ngsIqPe"


ydl_opts = {
    'outtmpl': '%(id)s.%(ext)s',        
}


ydl = youtube_dl.YoutubeDL(ydl_opts)
with ydl:
    data = ydl.extract_info(url, download=False)

for i in data["entries"]:
    print(i["webpage_url"])



