import os
import json


def Generate_JSON():
    user_home = os.path.expanduser("~")
    path = os.path.sep.join([user_home, 'Downloads', 'video'])
    if not os.path.isdir(path):
        os.mkdir(path)
    data = { "path": path }
    with open('data.json', 'w') as json_file:
        json.dump(data, json_file)


def Get_Path_From_JSON():
    with open("data.json", "r") as jsonFile:
        data = json.load(jsonFile)
    return data["path"]


def Set_Path_From_JSON(filename):
    with open("data.json", "r") as jsonFile:
        data = json.load(jsonFile)
    
    data["path"] = filename
    with open("data.json", "w") as jsonFile:
        json.dump(data, jsonFile)
