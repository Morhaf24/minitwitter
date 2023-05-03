const postInput = document.getElementById("post_input");
let editTweetRequest;
let finishButton = document.getElementById("product-button");

finishButton.addEventListener("submit", onEditButtonPressed);

function onEditButtonPressed(event) {
    event.preventDefault();

    let tweetData = {
        content: postInput.value
    };
    
    editTweetRequest = new XMLHttpRequest();
    editTweetRequest.open("PUT", "http://localhost:4200/tweet/" + window.location.hash.substring(1));
    editTweetRequest.setRequestHeader("Content-Type", "application/json");
    editTweetRequest.onreadystatechange = onEditResponsed;
    editTweetRequest.send(JSON.stringify(tweetData));   
}

function onEditResponsed(event) {
    if (editTweetRequest.readyState < 4) {
        return;
    }

    let responseStatus = editTweetRequest.status;

    if (responseStatus === 200) {
       alert("Successfuly updated.");
       window.location.replace('http://localhost:4200/home.html')
    }
    else if (responseStatus === 403) {
        alert("You can't edit this tweet")
    }
    else {
       alert("Error: Please try again");
    }}

