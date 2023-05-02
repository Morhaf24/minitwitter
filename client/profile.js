const createPost = document.getElementById("create_post");
const postInput = document.getElementById("post_input");
const mainWindow = document.getElementById("mainWindow");
const passwordForm = document.getElementById("edit_password");
const passwordInput = document.getElementById("password_input");
let passwordRequest;


let myTweetsRequest = new XMLHttpRequest();
myTweetsRequest.open("GET", "http://localhost:4200/myTweets");
myTweetsRequest.onreadystatechange = onListResponse;
myTweetsRequest.send();

function onListResponse() {
    if (myTweetsRequest.readyState < 4) {
        return;
    }

    tweetsResponseStatus = myTweetsRequest.status;
    
    if (tweetsResponseStatus === 200) {
        tweetsResponse = JSON.parse(myTweetsRequest.responseText);
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
    else if (tweetsResponseStatus === 401) {
        alert("Unauthorized")
    }
    else if (tweetsResponseStatus === 204) {
        alert("No tweets found")
    }
}

const usernameForm = document.getElementById("edit_username");
const usernameInput = document.getElementById("username_input");
let usernameRequest;

usernameForm.addEventListener("submit", onUsernameFormSubmitted);

function onUsernameFormSubmitted(event) {
    event.preventDefault();

    const usernameData = {
        name: usernameInput.value
    };

    console.log(usernameData);
    
    usernameRequest = new XMLHttpRequest();
    usernameRequest.open("PUT", "http://localhost:4200/user");
    usernameRequest.setRequestHeader("Content-Type", "application/json");
    usernameRequest.onreadystatechange = onUsernameResponse;
    usernameRequest.send(JSON.stringify(usernameData));
}

function onUsernameResponse() {
    if (usernameRequest.readyState < 4) {
    return;
    }
      const responseStatus = usernameRequest.status;
      if (responseStatus === 200) {
        alert("Success");
        window.location.replace('http://localhost:4200')
      } else {
        alert("Login failed");
      }
}


passwordForm.addEventListener("submit", onPasswordFormPressed);

function onPasswordFormPressed(event) {
    event.preventDefault();


}

  