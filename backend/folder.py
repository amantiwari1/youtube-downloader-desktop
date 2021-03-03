import os
import xml.etree.ElementTree as ET 
from xml.dom import minidom



def Generate_XML():
    path = os.path.expanduser("~") + '\Downloads\\video'
    if not os.path.isdir(path):
        os.mkdir(path)
    fileName = "data.xml" 
    root = ET.Element("Data")
    Save = ET.Element("Savefolder")
    root.append (Save)
    b1 = ET.SubElement(Save, "Path")
    b1.text = path
    tree = ET.ElementTree(root)
    with open (fileName, "wb") as files:
        tree.write(files) 

def Get_Path_From_XML():
    file = minidom.parse('data.xml')
    Savefolder = file.getElementsByTagName('Path')
    return Savefolder[0].firstChild.data


def Set_Path_From_XML(filename):
    data = ET.parse("data.xml")
    root = data.getroot()
    root[0][0].text = filename
    tree = ET.ElementTree(root) 
    with open ('data.xml', "wb") as files:
        tree.write(files) 
    return "Success"
