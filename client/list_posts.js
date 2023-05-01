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

        let likeDiv = document.createElement("div");
        likeDiv.innerHTML = tweetsResponse[i].likes || "0";
        likeDiv.className = "likesDiv";
        tweetsDiv.appendChild(likeDiv);

        let dislikeDiv = document.createElement("div");
        dislikeDiv.innerHTML = tweetsResponse[i].dislike || "0";;
        dislikeDiv.className = "dislikesDiv";
        tweetsDiv.appendChild(dislikeDiv);

        let commentDiv = document.createElement("div");
        commentDiv.innerHTML = tweetsResponse[i].comments || "no comments";
        commentDiv.className = "commentDiv";
        tweetsDiv.appendChild(commentDiv);
    }
}