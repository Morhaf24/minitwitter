const createPost = document.getElementById("create_post");
const postInput = document.getElementById("post_input");
const mainWindow = document.getElementById("mainWindow");
const passwordForm = document.getElementById("edit_password");
const passwordInput = document.getElementById("password_input");
const usernameForm = document.getElementById("edit_username");
const usernameInput = document.getElementById("username_input");
const logout = document.getElementById("logout");
let logoutRequest;
let usernameRequest;
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

            const profileName = document.getElementById("profile_name");
            profileName.innerHTML = "Welcome " + tweetsResponse[i].name + " ^_^";
            profileName.className = "profileName";
            if (tweetsResponse[i].name === "admin") {
                const adminNav = document.getElementById("admin-nav");
                adminNav.innerHTML = "admin";
                adminNav.addEventListener("click", onAdminNavClicked)
            }

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
            editButton.className = "editButton";
            editButton.setAttribute("edit-tweet-id", tweetsResponse[i].id);
            editButton.addEventListener("click", onEditButtonPressed);
            tweetDiv.appendChild(editButton);
        }
    }
    else if (tweetsResponseStatus === 401) {
        alert("Unauthorized")
    }
    else if (tweetsResponseStatus === 204) {
        alert("No tweets found")
    }
}


usernameForm.addEventListener("submit", onUsernameFormSubmitted);

function onUsernameFormSubmitted(event) {
    event.preventDefault();

    const usernameData = {
        name: usernameInput.value
    };
    
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

    const passwordData = {
        oldPassword: oldPasswordInput.value,
        password: passwordInput.value
        };

        passwordRequest = new XMLHttpRequest();
        passwordRequest.open("PUT", "http://localhost:4200/user");
        passwordRequest.setRequestHeader("Content-Type", "application/json");
        passwordRequest.onreadystatechange = onPasswordResponse;
        passwordRequest.send(JSON.stringify(passwordData));
}

function onPasswordResponse() {
    if (passwordRequest.readyState < 4) {
    return;
    }
      const responseStatus = passwordRequest.status;
      if (responseStatus === 200) {
        alert("Success");
        window.location.replace('http://localhost:4200')
      } else {
        alert("Login failed");
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

logout.addEventListener("click", onLogoutRequest);

function onLogoutRequest(event) {
    event.preventDefault();

    logoutRequest = new XMLHttpRequest();
    logoutRequest.open("POST", "http://localhost:4200/logout");
    logoutRequest.onreadystatechange = onlogoutResponsed;
    logoutRequest.send();
}

function onlogoutResponsed() {
    if (logoutRequest.readyState < 4) {
        return;
    }

    responseStatus = logoutRequest.status;

    if (responseStatus === 200) {
        window.location.replace('http://localhost:4200')
    }
}

function onAdminNavClicked(event) {
    window.open("admin.html"); 
}