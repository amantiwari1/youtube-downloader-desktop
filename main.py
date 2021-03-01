import os
import platform
import eel
from backend import youtube, downloadvideo


@eel.expose
def Add_Details(url):
    """ This function is where to get all details in youtube in a video 
    through url and return all details in youtube to javascript
    """
    if not youtube.Check_Url(url):
        return ["Wrong link", ""]
    YoutubeObject = youtube.youtube(url)
    AllDetails =  YoutubeObject.Get_Data_Details()
    return AllDetails





@eel.expose
def Download_video(data):
    """This function is used to download video to save video
    """
    downloadvideo.Download_Video(data)




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
