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

    tweetsResponseStatus = listRequest.status;
    
    if (tweetsResponseStatus === 200) {
        tweetsResponse = JSON.parse(listRequest.responseText);
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
            let likeButton = document.createElement("button")
            likeButton.className = "likeButton";
            likeButton.innerHTML = "like"
            likeDiv.innerHTML = tweetsResponse[i].likes || "0";
            likeDiv.className = "likesDiv";
            likeDiv.appendChild(likeButton);
            tweetsDiv.appendChild(likeDiv);

            let dislikeDiv = document.createElement("div");
            let disLikeButton = document.createElement("button")
            disLikeButton.className = "disLikeButton";
            disLikeButton.innerHTML = "dislike"
            dislikeDiv.innerHTML = tweetsResponse[i].dislike || "0";;
            dislikeDiv.className = "dislikesDiv";
            likeDiv.appendChild(dislikeDiv);
            likeDiv.appendChild(disLikeButton);

            let commentDiv = document.createElement("div");
            let commentInput = document.createElement("input");
            let commentButton = document.createElement("button");
            let commentLabel = document.createElement("label");
            commentButton.className = "commentButton";
            commentButton.innerHTML = "comment"
            commentInput.className = "commentInput";
            commentInput.placeholder = "Comment";
            commentDiv.innerHTML = "Comments";
            commentDiv.innerHTML = tweetsResponse[i].comments || "no comments";
            commentDiv.className = "commentDiv";
            tweetsDiv.appendChild(commentInput);
            tweetsDiv.appendChild(commentButton)
            tweetsDiv.appendChild(commentDiv);
        }
    }
    else if (tweetsResponseStatus === 401) {
        alert("Unauthorized")
    }
    else {
        alert("Try again")
    }
}
