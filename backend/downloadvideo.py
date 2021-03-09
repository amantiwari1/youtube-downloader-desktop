import eel
import requests
from .function import format_filename  
import os
from multiprocessing import Process


def Download_Video(data):

    send_proceess = eel.Set_Download_Percent
    url =data['url']

    videopath = start_download_video(
        url=url,
        filename='video',
        urlvideo=data['urlvideo'],
        path=data['path'],
        send_proceess=send_proceess
    )

    audiopath  = start_download_video(
        url=url,
        filename='audio',
        urlvideo=data['audiourl'],
        path=data['path'],
        send_proceess=send_proceess
    )

    

    process = Process(
        target=combine_audio, 
        args=(
            videopath,
            audiopath,
            f"{data['path']}/{format_filename(data['title'])}.webm",
            url,
            ))
    
    send_proceess({"text":"combining video and audio", "url": url })
    process.start()
    process.join() 
    send_proceess({"text":"Successfull", "url": url })


    try: 
        os.remove(audiopath)
    except:
        eel.isErrorDownload()
    

    
def combine_audio(vidname, audname, outname,url,fps=60):
    import moviepy.editor as mpe
    my_clip = mpe.VideoFileClip(vidname)
    audio_background = mpe.AudioFileClip(audname)
    final_clip = my_clip.set_audio(audio_background)
    final_clip.write_videofile(outname,fps=fps)


def start_download_video(path, filename, urlvideo, url, send_proceess):

    fullpath = f"{path}/{filename}.webm"
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