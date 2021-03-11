import eel
import requests
from .function import format_filename  
import os
import subprocess


def Download_Video(data):

    send_proceess = eel.Set_Download_Percent
    url =data['url']

    videopath = start_download_video(
        url=url,
        filename=f'video.{data["ext"]}',
        urlvideo=data['urlvideo'],
        path=data['path'],
        send_proceess=send_proceess
    )

    audiopath  = start_download_video(
        url=url,
        filename='audio.m4a',
        urlvideo=data['audiourl'],
        path=data['path'],
        send_proceess=send_proceess
    )

    

    
    
    send_proceess({"text":"combining video and audio", "url": url })
    subprocess.call(f'ffmpeg.exe -y -i "{videopath}" -i "{audiopath}" -c:v copy -c:a aac "{data["path"]}/{format_filename(data["title"])}.mp4"')
    send_proceess({"text":"Successfull", "url": url })


    try: 
        os.remove(audiopath)
        os.remove(videopath)
    except:
        eel.isErrorDownload('cant remove video and audio')
    
    

    
def combine_audio(vidname, audname, outname):
    subprocess.call(f'ffmpeg.exe -y -i "{vidname}" -i "{audname}" -c:v copy -c:a aac "{outname}"', shell=True)


def start_download_video(path, filename, urlvideo, url, send_proceess):

    fullpath = f"{path}/{filename}"
    with open(fullpath, "wb") as f:
        response = requests.get(urlvideo, stream=True)
        total_length = response.headers.get('content-length')

        if total_length is None: # no content length header
            f.write(response.content)
        else:
            dl = 0
            total_length = int(total_length)
            for data in response.iter_content(chunk_size=4096):
                dl += len(data)
                f.write(data)
                percent= int(dl/total_length*100)

                name = ""

                if filename == 'audio':
                    name= f"Downloding audio... {percent} %"
                else:
                    name= f"Downloding video... {percent} %"

                send_proceess({"text":name, "url": url})
                if percent >= 100:
                    send_proceess({"text":"Sucess... 100 %", "url": url })

    return  fullpath