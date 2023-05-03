const createPost = document.getElementById("create_post");
const postInput = document.getElementById("post_input");
const mainWindow = document.getElementById("mainWindow");
let commentRequest;

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
            likeButton.innerHTML = "like";
            likeButton.setAttribute("like-id", tweetsResponse[i].id);
            likeButton.addEventListener("click", onLikeButtonPressed);
            likeDiv.innerHTML = tweetsResponse[i].likes || "0";
            likeDiv.className = "likesDiv";
            likeDiv.appendChild(likeButton);
            tweetsDiv.appendChild(likeDiv);

            let dislikeDiv = document.createElement("div");
            let disLikeButton = document.createElement("button")
            disLikeButton.className = "disLikeButton";
            disLikeButton.innerHTML = "dislike";
            disLikeButton.setAttribute("like-id", tweetsResponse[i].id);
            disLikeButton.addEventListener("click", onDislikeButtonPressed);
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
            commentInput.setAttribute("input", commentInput)
            commentButton.setAttribute("comment-content-id", tweetsResponse[i].id);
            commentButton.addEventListener("click", onCommentButtonPressed);
            tweetsDiv.appendChild(commentInput);
            tweetsDiv.appendChild(commentButton)
            tweetsDiv.appendChild(commentDiv);

            let deleteAndEditCell = document.createElement("div");
            tweetsDiv.appendChild(deleteAndEditCell);
            deleteAndEditCell.className = "delete-and-edit-td";
        
            let deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            deleteButton.className = "deleteButton";
            deleteButton.setAttribute("delete-tweet-id", tweetsResponse[i].id);
            deleteButton.addEventListener("click", onDeleteButtonPressed);
            tweetDiv.appendChild(deleteButton);
          
            let editButton = document.createElement("button");
            editButton.innerText = "Edit";
            editButton.className = "editButton"
            editButton.setAttribute("edit-tweet-id", tweetsResponse[i].id);
            editButton.addEventListener("click", onEditButtonPressed);
            tweetDiv.appendChild(editButton);
        }
    }
    else if (tweetsResponseStatus === 401) {
        alert("Unauthorized");
        window.location.replace('http://localhost:4200');
    }
    else if (tweetsResponseStatus === 204) {
        alert("No tweets found")
    }
    else {
        alert("Try again")
    }
}

function onDeleteButtonPressed(event) {
    deleteRequest = new XMLHttpRequest();
    deleteRequest.open("Delete", "http://localhost:4200/tweet/" + event.currentTarget.getAttribute("delete-tweet-id"));
    deleteRequest.onreadystatechange = onDeleteResponsed;
    deleteRequest.send();
}

function onDeleteResponsed() {
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

function onCommentButtonPressed(event) {
    let commentData = {
        comment: event.currentTarget.previousSibling.value
    };
    
    commentRequest = new XMLHttpRequest();
    commentRequest.open("POST", "http://localhost:4200/comment/" + event.currentTarget.getAttribute("comment-content-id"));
    commentRequest.setRequestHeader("Content-Type", "application/json");
    commentRequest.onreadystatechange = onCommentResponsed;
    commentRequest.send(JSON.stringify(commentData));  
}


function onCommentResponsed(event) {
    if (commentRequest.readyState < 4) {
        return;
    }

    let responseStatus = commentRequest.status;

    if (responseStatus === 200) {
       alert("Successfuly updated.");
       window.location.replace('http://localhost:4200/home.html')
    }
    else {
       alert("Error: Please try again");
    }}

    
function onLikeButtonPressed(event) {
    likeRequest = new XMLHttpRequest();
    likeRequest.open("PUT", "http://localhost:4200/like/" + event.currentTarget.getAttribute("like-id"));
    likeRequest.onreadystatechange = onLikeResponsed;
    likeRequest.send();
}

function onLikeResponsed() {
if (likeRequest.readyState < 4) {
    return;
}

responseStatus = likeRequest.status;

if (responseStatus === 200) {
    window.location.reload();
}
else {
    alert("Not found");
}
}

function onDislikeButtonPressed(event) {
    likeRequest = new XMLHttpRequest();
    likeRequest.open("PUT", "http://localhost:4200/dislike/" + event.currentTarget.getAttribute("like-id"));
    likeRequest.onreadystatechange = onDislikeResponsed;
    likeRequest.send();
}

function onDislikeResponsed() {
if (likeRequest.readyState < 4) {
    return;
}

responseStatus = likeRequest.status;

if (responseStatus === 200) {
    window.location.reload();
}
else {
    alert("Not found");
}
}