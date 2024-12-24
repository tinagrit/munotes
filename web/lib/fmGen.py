# Script to generate directory for munotes file system

import os
import datetime
import json
import shutil

# Path of the FOLDER you want to export
path = "/Users/tinagrit/Library/Mobile Documents/iCloud~md~obsidian/Documents/MACM 101"

# Path of the output (they cannot be in the same folder as the path above)
output = "/Users/tinagrit/Documents/ObsidianExport/Home/macmsource/"

# URL for hyperlink (don't include "source/")
sourcestarting = "https://munotes.tinagrit.com/macmsource/"

# Files and folders EXACTLY matching these names will be ignored
ignore = [".DS_Store","Slides",".obsidian"]

# Sort alphabetically
doSort = True



def simplify(name):
    return str(name).lower().replace(" ","-").replace("_","-")

def extract(localpath=""):
    global path,output,sourcestarting,ignore,doSort
    result = []
    files = os.listdir(path+localpath)

    if doSort: files.sort()

    for file in files:
        if file in ignore: continue

        if os.path.isfile(path+localpath+file):
            filename = file
            filetype = os.path.splitext(path+localpath+file)[1][1:]
            filesize = (os.stat(path+localpath+file).st_size * (10) // (1024 * 1024)) / 10
            filedateEpoch = os.path.getctime(path+localpath+file)
            filedateFormatted = datetime.datetime.fromtimestamp(filedateEpoch).strftime("%d %b %Y")

            result.append({
                "type": "file",
                "filetype": filetype,
                "name": filename,
                "size": f"{filesize} MB",
                "date": filedateFormatted,
                "source": f"{sourcestarting}source/{simplify(localpath)}{simplify(filename)}"
            })

            if not os.path.exists(output+"source/"+simplify(localpath)):
                os.makedirs(output+"source/"+simplify(localpath))
            shutil.copy2(path+localpath+file,output+"source/"+simplify(localpath)+simplify(filename))

        else:
            dirname = file
            nextpath = localpath + file + "/"

            result.append({
                "type": "directory",
                "name": dirname,
                "content": extract(nextpath)
            })
    return result



if path[-1] != "/": path += "/"
if output[-1] != "/": output += "/"

if not os.path.exists(path):
    raise ValueError("Path does not exist")

if not os.path.exists(output+"source/"):
    os.makedirs(output+"source/")

if not os.path.exists(output):
    os.makedirs(output)

with open(f'{output}directory.json', 'w') as file:
    file.write(json.dumps(extract()))