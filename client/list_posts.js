const createPost = document.getElementById("create_post");
const postInput = document.getElementById("post_input");
const mainWindow = document.getElementById("mainWindow");

let listRequest = new XMLHttpRequest();
listRequest.open("GET", "http://localhost:4200/tweets");
listRequest.onreadystatechange = onListResponse;
listRequest.send();

function onListResponse() {
    if (listRequest.readyState < 4) {
        return;
    }

    tweetsResponse = JSON.parse(listRequest.responseText);
    console.log(tweetsResponse);

    for (var i = 0; i < tweetsResponse.length; i++) {
        let tweetsDiv = document.createElement("div");
        tweetsDiv.className = "tweetsDiv";
        mainWindow.appendChild(tweetsDiv);

        let profileDiv = document.createElement("div");
        profileDiv.innerHTML = tweetsResponse[i].name;
        profileDiv.className = "profileDiv";
        tweetsDiv.appendChild(profileDiv);

        let tweetDiv = document.createElement("div");
        tweetDiv.innerHTML = tweetsResponse[i].content;
        tweetDiv.className = "tweetDiv";
        tweetsDiv.appendChild(tweetDiv);

        let feedBackDiv = document.createElement("div");
        feedBackDiv.innerHTML = tweetsResponse[i].likes
        feedBackDiv.className = "tweetDiv";
        tweetsDiv.appendChild(feedBackDiv);

        let commentDiv = document.createElement("div");
        tweetDiv.innerHTML = tweetsResponse[i].comments;
        feedBackDiv.className = "commentDiv";
        tweetsDiv.appendChild(commentDiv);

        var deleteEditDiv = document.createElement("div");
        tweetsDiv.appendChild(deleteEditDiv);

        var deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.setAttribute("delete-post");
        deleteButton.addEventListener("click", onDeleteButtonPressed);
        deleteEditCell.appendChild(deleteButton);

        var editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.setAttribute("edit-post");
        editButton.addEventListener("click", onEditButtonPressed);
        deleteAndEditCell.appendChild(editButton);
    }
}