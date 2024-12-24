let courses = null;

const updateSort = (sorter) => {
    let sortBy = "term";
    if (sorter != null) sortBy = sorter.value;

    if (courses != null) {
        if (document.body.classList.contains('onload')) {
            document.body.classList.remove('onload')
        }

        document.getElementById('lists').innerHTML = "";

        let sortedCourse = {};
        if (sortBy === "term") {
            for (let i=0; i<courses.length; i++) {
                if (!Object.keys(sortedCourse).includes(courses[i].term)) {
                    sortedCourse[courses[i].term] = [courses[i]];
                } else {
                    sortedCourse[courses[i].term].push(courses[i]);
                }
            }
        } else if (sortBy === "course") {
            for (let i=0; i<courses.length; i++) {
                if (!Object.keys(sortedCourse).includes(courses[i].subject)) {
                    sortedCourse[courses[i].subject] = [courses[i]];
                } else {
                    sortedCourse[courses[i].subject].push(courses[i]);
                }
            }
        }

        for (let [key, value] of Object.entries(sortedCourse)) {
            let category = document.createElement('div');
            category.classList.add('category');

            let categoryName = document.createElement('h2');
            categoryName.innerHTML = key;
            category.appendChild(categoryName);

            for (let i=0; i<value.length; i++) {
                let subject = document.createElement('a');
                subject.classList.add('subject');
                subject.href = value[i]["url"]

                let subjectCode = document.createElement('h3');
                subjectCode.classList.add("subjectCode");
                subjectCode.innerHTML = value[i]["name"];
                subject.appendChild(subjectCode);

                for (let flairData of value[i]["flair"]) {
                    let flair = document.createElement('span');
                    flair.classList.add('flair');
                    flair.innerHTML = flairData["message"];
                    flair.setAttribute("data-flaircolour",flairData["color"])
                    subject.appendChild(flair)
                }

                let subjectName = document.createElement('p');
                subjectName.classList.add("subjectName");
                subjectName.innerHTML = value[i]["description"];
                subject.appendChild(subjectName);

                category.appendChild(subject)
            }

            document.getElementById('lists').appendChild(category)
        }

        document.body.classList.add('onload')
    }
}

const cmInit = (url, sorter=null) => {
    fetch(url)
        .then(response => {return response.json()})
        .then(data => {
            courses = data;
            updateSort(sorter)
        })
        .catch(err => {
            document.body.classList.add('onerror');
        })
    if (sorter != null) sorter.addEventListener('change',()=>{updateSort(sorter)});
}


