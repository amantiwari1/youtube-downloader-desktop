import eel
import requests
from .function import format_filename  


def Download_Video(data):
    
    with open(f"{data['path']}/{format_filename(data['title'])}.mp4", "wb") as f:
        response = requests.get(data["urlvideo"], stream=True)
        total_length = response.headers.get('content-length')
        url = data['url']

        if total_length is None: # no content length header
            f.write(response.content)
        else:
            dl = 0
            total_length = int(total_length)
            for data in response.iter_content(chunk_size=4096):
                dl += len(data)
                f.write(data)
                percent= int(dl/total_length*100)

                eel.Set_Download_Percent({"text":f"Downloding... {percent} %", "url": url})
                if percent >= 100:
                    eel.Set_Download_Percent({"text":"Sucess... 100 %", "url": url })

