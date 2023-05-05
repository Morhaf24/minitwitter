const postInput = document.getElementById("post_input");
let editCommentRequest;
let editCommentButton = document.getElementById("product-button");

editCommentButton.addEventListener("submit", onEditCommentButtonPressed);

function onEditCommentButtonPressed(event) {
    event.preventDefault();

    let commentData = {
        content: postInput.value
    };

    editCommentRequest = new XMLHttpRequest();
    editCommentRequest.open("PUT", "http://localhost:4200/comment/" + window.location.hash.substring(1));
    editCommentRequest.setRequestHeader("Content-Type", "application/json");
    editCommentRequest.onreadystatechange = onEditCommentResponsed;
    editCommentRequest.send(JSON.stringify(commentData));
}

function onEditCommentResponsed(event) {
    if (editCommentRequest.readyState < 4) {
        return;
    }

    let responseStatus = editCommentRequest.status;

    if (responseStatus === 200) {
        alert("Successfuly updated.");
        window.location.replace('http://localhost:4200/home.html')
    }
    else if (responseStatus === 403) {
        alert("You can't edit this tweet")
    }
    else {
        alert("Error: Please try again");
    }
}

