window.onload = function() {
    fetch("/home").then( (res) => res.json() ).then( (docs) => {
        let list = "<table><tr><td>database-id</td><td>名前</td><td>生年月日</td><td>入所年月日</td><td>所属</td><td>役職</td></tr>";
        for (const doc of docs) {
            let row = "<tr>" + 
            "<td>" + doc._id + 
            "</td><td>" + doc.name +
            "</td><td>" + doc.birthday +
            "</td><td>" + doc.joinday +
            "</td><td>" + doc.group +
            "</td><td>" + doc.job +
            "</td></tr>";
            list += row;
        }
        list += "</table>";
        document.getElementById("accounts-list").innerHTML = list;
    });

    const saveButton = document.getElementById("save");
    saveButton.addEventListener("click", (event) => {

        const params = {
            method: "POST",
            body: JSON.stringify({
                name: document.getElementById("name").value,
                birthday: document.getElementById("birthday").value,
                joinday: document.getElementById("joinday").value,
                group: document.getElementById("group").value,
                job: document.getElementById("job").value
            }),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin"
        };

        fetch("/home", params).then( (res) => res.json() ).then( (docs) => {

            let list = "<table><tr><td>名前</td><td>生年月日</td><td>入所年月日</td><td>所属</td><td>役職</td></tr>";
            for (const doc of docs) {
                let row = "<tr>" + 
                "<td>" + doc.name + 
                "</td><td>" + doc.birthday +
                "</td><td>" + doc.joinday +
                "</td><td>" + doc.group +
                "</td><td>" + doc.job +
                "</td></tr>";
                list += row;
            }
            list += "</table>";
            document.getElementById("accounts-list").innerHTML = list;
        });
    //     const name = document.getElementById("name");

    //     alert(name.value);
    }, false);
}