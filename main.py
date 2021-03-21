import os
import platform
import eel
from backend import youtube, downloadvideo, folder, function
import PySimpleGUI as sg
import webbrowser
import youtube_dl
from backend.database import session
from backend.models.video import Video
import ast



@eel.expose
def Get_All_Details():
    """
    This function used to get all video details which user already inserted all url

    call this function and send all data to javascript and save it in alldetails in js
    """
    AllVideoData = session.query(Video)

    arr = []
    UrlExist = []

    for video in AllVideoData:
        arr.append(
            {
                "id": video.id,
                "url": video.url,
                "title": video.title,
                "thumbnail": video.thumbnail,
                "downloadPercent": "",
                "videoquality": ast.literal_eval(video.videoquality)
            }
        )
        UrlExist.append(video.url)

    return {"data":arr, "UrlExist": UrlExist}


@eel.expose
def DeleteVideo(id):
    """
    this function is delete a video in sqlite3 through session 
    it will call this function by user tap remove icon in card Gui
    """
    deletevideo = session.query(Video).filter(Video.id==id).first()
    session.delete(deletevideo)
    session.commit()

@eel.expose
def Add_Details(url):
    """ This function is where to get all details in youtube in a video 
    through url and return all details in youtube to javascript
    """
    try:
        if function.is_connected():
            eel.is_not_connected(False)
            YoutubeObject = youtube.youtube(url)
            
            YoutubeObject.Get_Data_Details()


            # this functions used to add new video in Gui which is above
            # already new video by user insert to call js to add new video
            eel.set_AllDetails(Get_All_Details())


            return True
        else:
            eel.is_not_connected(True)
            return False
        
    except:
        pass


@eel.expose
def Download_video(data):
    """This function is used to download video to save video
    """
    downloadvideo.Download_Video(data)


@eel.expose
def Select_folder():
    # show an "Open" dialog box and return the path to the selected file
    filename = sg.popup_get_folder('', no_window=True, keep_on_top=True)
    return filename


@eel.expose
def Get_Path_Folder():
    path = 'data.json'
    if not os.path.isfile(path):
        folder.Generate_JSON()

    return folder.Get_Path_From_JSON()


@eel.expose
def Set_Path_Folder(fileaame):
    folder.Set_Path_From_JSON(fileaame)


@eel.expose
def Open_Folder(folder):
    """
    This is folder where download and save file and 
    this function used for open floder 
    """
    webbrowser.open(os.path.realpath(folder))


@eel.expose
def Get_Data_Details_Playlists(url):
    """
    To get all video details in playlist to javascript
    """
    ydl_opts = {
        'outtmpl': '%(id)s.%(ext)s',
    }
    try:
        if function.is_connected():
            eel.is_not_connected(False)
            ydl = youtube_dl.YoutubeDL(ydl_opts)
            with ydl:
                data = ydl.extract_info(url, download=False)
                All_Video_Data = youtube.Get_Array_With_Playlist_Data(data)

                eel.set_AllDetails(Get_All_Details())
                if All_Video_Data == []:
                    raise Exception()
                else:
                    return [True]
        else:
            eel.is_not_connected(True)
            return []

    except:
        return []
    

@eel.expose
def All_Quality_Match(data):
    """
    common quality in all video 
    """
    if len(data) > 1:
        ans = sorted(list(set.intersection(*map(set,data))), key=function.natural_keys)
    elif len(data) == 1:
        ans = data[0]
    else:
        ans = []


    return ans


def start_eel(develop):
    """Start Eel with either production or development configuration."""

    if develop:
        directory = 'src'
        app = None
        page = {'port': 3000}
    else:
        directory = 'build'
        app = 'chrome-app'
        page = 'index.html'

    eel.init(directory, ['.tsx', '.ts', '.jsx', '.js', '.html'])

    eel_kwargs = dict(
        host='localhost',
        port=8080,
        size=(800, 800),
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
