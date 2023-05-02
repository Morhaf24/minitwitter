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
        for (let i = 0; i < tweetsResponse.length; i++) {
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

            let deleteAndEditCell = document.createElement("div");
            tweetsDiv.appendChild(deleteAndEditCell);
            deleteAndEditCell.className = "delete-and-edit-td";
        
            let deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            deleteButton.className = "edit-and-delete-button";
            deleteButton.setAttribute("delete-tweet-id", tweetsResponse[i].id);
            deleteButton.addEventListener("click", onDeleteButtonPressed);
            tweetsDiv.appendChild(deleteButton);
          
            let editButton = document.createElement("button");
            editButton.innerText = "Edit";
            editButton.className = "edit-and-delete-button"
            editButton.setAttribute("edit-tweet-id", tweetsResponse[i].id);
            editButton.addEventListener("click", onEditButtonPressed);
            tweetsDiv.appendChild(editButton);
        }
    }
    else if (tweetsResponseStatus === 401) {
        alert("Unauthorized")
    }
    else {
        alert("Try again")
    }
}

function onDeleteButtonPressed(event) {
    deleteRequest = new XMLHttpRequest();
    deleteRequest.open("Delete", "http://localhost:4200/tweet/" + event.currentTarget.getAttribute("delete-tweet-id"));
    deleteRequest.onreadystatechange = onCategoryDeleteResponsed;
    deleteRequest.send();
}

function onCategoryDeleteResponsed() {
if (deleteRequest.readyState < 4) {
    return;
}

responseStatus = deleteRequest.status;

if (responseStatus === 200) {
    alert("Deleted");
    window.location.reload();
}
else {
    alert("Not found");
}
}

function onEditButtonPressed(event) {
    window.open("edit_tweet.html#" + event.currentTarget.getAttribute("edit-tweet-id"), "_self"); 
}
