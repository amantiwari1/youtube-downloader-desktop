import re
import string
from urllib.parse import urlparse


def atoi(text):
        return int(text) if text.isdigit() else text

def natural_keys(text):
    """
    this function used for sorted in string along with number
    
    for example: 

    from 

    ['1080p','144p', '360p' , '240p', 'tiny' , '720p', '480p']
    
    to 
    
    ['144p', '240p', '360p', '480p', '720p', '1080p', 'tiny']
    """
    return [atoi(c) for c in re.split('(\d+)', text)]

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
    # filename = filename.replace(' ', '_')  # I don't like spaces in filenames.
    return filename


def Check_Url(url):
    """check url is vaild or not"""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False

import socket


def is_connected():
    try:
        # connect to the host -- tells us if the host is actually
        # reachable
        socket.create_connection(("1.1.1.1", 53))
        return True
    except OSError:
        pass
    return False