let content = null;
let mainPath = null;

const updateDir = (dir) => {
    if (!dir || content == null) return false;

    if (dir === "//") dir = "/";

    let contentToLoad = null;

    document.getElementById('pathName').innerHTML = mainPath + dir;

    document.getElementById('files').innerHTML = "";
    window.scrollTo(0,0)

    if (dir === "/") {
        contentToLoad = content;
    } else {
        keywords = dir.split("/");
        contentToLoad = content;

        for (let i=1; i<(keywords.length - 1); i++) {
            search = contentToLoad.filter(item => {
                return (item["type"] === "directory") && (item["name"] === keywords[i]);
            })
            if (search.length > 0) {
                contentToLoad = search[0]["content"]
            }
        }    
        dotdotPath = '/' + keywords.slice(1,-2).join('/') + '/';
        goBackItem = `<div class="item" onclick="updateDir('${dotdotPath}')"><div class="identifiers return"><p class="name">..</p><p class="size">Go back</p></div></div>`;
        document.getElementById('files').innerHTML += goBackItem;
    }

    if (document.body.classList.contains('onload')) {
        document.body.classList.remove('onload')
    }


    for (let i=0; i<contentToLoad.length; i++) {
        let item = document.createElement('a');
        item.classList.add('item');

        let identifiers = document.createElement('div');
        identifiers.classList.add('identifiers');

        if (contentToLoad[i]["type"] === "file") {
            item.href = contentToLoad[i]["source"]
            if (contentToLoad[i]["filetype"]) identifiers.classList.add(contentToLoad[i]["filetype"]);
        } else if (contentToLoad[i]["type"] === "directory") {
            item.onclick = () => {
                path = dir + contentToLoad[i]["name"] + '/'
                updateDir(path)
            }
            identifiers.classList.add("directory")
        }

        let itemName = document.createElement('p');
        itemName.classList.add('name');
        itemName.innerHTML = contentToLoad[i]["name"];
        identifiers.appendChild(itemName);

        let itemSize = document.createElement('p');
        itemSize.classList.add("size")

        if (contentToLoad[i]["type"] === "file") {
            itemSize.innerHTML = contentToLoad[i]["size"];
            identifiers.appendChild(itemSize);

            let itemDate = document.createElement('p');
            itemDate.classList.add('date')
            itemDate.innerHTML = contentToLoad[i]["date"];
            identifiers.appendChild(itemDate)
        } else if (contentToLoad[i]["type"] === "directory") {
            if (contentToLoad[i]["content"].length === 1) {
                itemSize.innerHTML = "1 file";  
            } else {
                itemSize.innerHTML = contentToLoad[i]["content"].length + " files";
            }
            identifiers.appendChild(itemSize);
        }

        item.appendChild(identifiers)
        document.getElementById('files').appendChild(item)
    }

    document.body.classList.add('onload')
}

const fmInit = (url,title,description) => {
    mainPath = '/' + title;

    document.title = title + " - munotes";
    document.getElementById('fmTitle').innerHTML = title;
    document.querySelector('meta[name="description"]').setAttribute("content", "munotes " + title + " - " + description);

    fetch(url)
        .then(response => {
            content = null;
            return response.json()
        })
        .then(data => {
            content = data;
            updateDir("/")
        })
        .catch(err => {
            document.body.classList.add('onerror');
            console.error("Fetch error")
        })
}

const directorize = (params) => {
    if (params.has("search")) {
        fetch('/web/lib/fm.json')
            .then(response => {return response.json()})
            .then(data => {
                if (data[params.get("search")]) {
                    fmInit(data[params.get("search")]["dirLocation"],data[params.get("search")]["title"],data[params.get("search")]["description"])
                } else {
                    document.body.classList.add('onerror');
                    console.error("Search not found")
                }
            })
    } else {
        document.body.classList.add('onerror');
        console.error("No URL parameter")
    }
}