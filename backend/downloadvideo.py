import eel
import requests
import sys
import string
import os

def Download_Video(data):
    path = "video"
    if not os.path.isdir(path):
        os.mkdir(path)


    with open(f"{path}/{format_filename(data['title'])}.mp4", "wb") as f:
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

def format_filename(s):
    """Take a string and return a valid filename constructed from the string.
Uses a whitelist approach: any characters not present in valid_chars are
removed. Also spaces are replaced with underscores.

Note: this method may produce invalid filenames such as ``, `.` or `..`
When I use this method I prepend a date string like '2009_01_15_19_46_32_'
and append a file extension like '.txt', so I avoid the potential of using
an invalid filename.
"""
    valid_chars = "-_.() %s%s" % (string.ascii_letters, string.digits)
    filename = ''.join(c for c in s if c in valid_chars)
    filename = filename.replace(' ', '_')  # I don't like spaces in filenames.
    return filename