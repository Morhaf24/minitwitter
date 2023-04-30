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

    for (const i = 0; i < tweetsResponse.length; i++) {         

        let tweetsDiv = document.createElement("div");
        mainWindow.appendChild(tweetsDiv);

        let userNameDiv = document.createElement("div");
        mainWindow.appendChild(userNameDiv);

        let passWordDiv = document.createElement("div");
        mainWindow.appendChild(passWordDiv);

        let profileDiv = document.createElement("div");
        tweetsDiv.appendChild(profileDiv);

        let tweetDiv = document.createElement("div");
        tweetsDiv.appendChild(tweetDiv);

        let feedBackDiv = document.createElement("div");
        tweetsDiv.appendChild(feedBackDiv);
        
        let commentDiv= document.createElement("div");
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

function onDeleteButtonPressed(event) {
    deleteRequest = new XMLHttpRequest();
    deleteRequest.open("Delete", ".http://localhost:4200/tweet" + event.currentTarget.getAttribute("delete-post"));
    deleteRequest.onreadystatechange = onProductDeleteResponsed;
    deleteRequest.send();
  }
  