import os
import platform
import eel
from backend import youtube


def send_progress(block_num, block_size, total_size):
    video_size = total_size/block_size
    percent = int((block_num / video_size) * 100)
    eel.Set_Download_Percent(f"Downloding... {percent} %")
    if percent >= 100:
        eel.Set_Download_Percent(f"Success... 100%")


@eel.expose
def Downloader(url):
    if not youtube.Check_Url(url):
        return ["Wrong link", ""]

    data = youtube.Get_Data_Details(url)

    title = data['title']
    thumbnail = data['thumbnail']
    formats = data["formats"]

    list_Of_formats = youtube.Get_Detail_Quality_Available(
        getDataFormat=formats
    )

    for format in formats:
        if list_Of_formats[0] == format["format_note"]:
            filesize = format["filesize"]
            videourl = format["url"]
            break
    
    eel.Set_Download_Percent(f"   ")


    return {
        "title": title,
        "thumbnail": thumbnail,
        "list_Of_formats": list_Of_formats,
        "formats": formats,
        "filesize": filesize,
        "videourl": videourl
    }


@eel.expose
def Download_video(detail, send_progress=send_progress):
    youtube.Download_Video(
        urlvideo=detail["urlvideo"],
        filename=f"{detail['title']}",
        send_progress=send_progress
    )


def start_eel(develop):
    """Start Eel with either production or development configuration."""

    if develop:
        directory = 'src'
        app = None
        page = {'port': 3000}
    else:
        directory = 'build'
        app = 'chrome'
        page = 'index.html'
    eel.init(directory, ['.tsx', '.ts', '.jsx', '.js', '.html'])

    eel_kwargs = dict(
        host='localhost',
        port=8080,
        size=(1280, 800),
    )
    try:
        eel.start(page, mode="chrome", **eel_kwargs)
    except EnvironmentError:
        # If Chrome isn't found, fallback to Microsoft Edge on Win10 or greater
        if sys.platform in ['win32', 'win64'] and int(platform.release()) >= 10:
            eel.start(page, **eel_kwargs)
        else:
            raise


if __name__ == '__main__':
    import sys

    # Pass any second argument to enable debugging
    start_eel(develop=len(sys.argv) == 2)
