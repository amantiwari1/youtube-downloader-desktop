import os
import platform
import eel
from backend import youtube, downloadvideo, folder, function
import PySimpleGUI as sg
import webbrowser
import youtube_dl


@eel.expose
def Add_Details(url):
    """ This function is where to get all details in youtube in a video 
    through url and return all details in youtube to javascript
    """
    if not function.Check_Url(url):
            return ["Wrong link", ""]

    try:
        
        YoutubeObject = youtube.youtube(url)
        AllDetails = YoutubeObject.Get_Data_Details()
        return AllDetails
        
    except:
        eel.isErrorDownload("This link might be problem and try again")



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
    ydl = youtube_dl.YoutubeDL(ydl_opts)
    with ydl:
        data = ydl.extract_info(url, download=False)

    arr_data = []

    for data in data["entries"]:
        youtube_obj = youtube.youtube(url=data["webpage_url"], data=data)
        AllDetails = youtube_obj.Get_Data_Details()
        arr_data.append(AllDetails)

    return arr_data


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
