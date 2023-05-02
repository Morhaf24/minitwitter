if (location.host.includes('localhost')) {
  // Load livereload script if we are on localhost
  document.write(
    '<script src="http://' +
    (location.host || 'localhost').split(':')[0] +
    ':35729/livereload.js?snipver=1"></' +
    'script>'
  )
}

let postForm = document.getElementById("create_post");
const contentInput = document.getElementById("post_input");
let postRequest;

postForm.addEventListener("submit", onPostFormSubmitted);

function onPostFormSubmitted(event) {
  event.preventDefault();

  const postData = {
    content: postInput.value
  };
  
  postRequest = new XMLHttpRequest();
  postRequest.open("POST", "http://localhost:4200/tweet");
  postRequest.setRequestHeader("Content-Type", "application/json");
  postRequest.onreadystatechange = onPostResponse;
  postRequest.send(JSON.stringify(postData));
}

function onPostResponse() {
  if (postRequest.readyState < 4) {
    const responseStatus = postRequest.status;
    if (responseStatus === 200) {
      window.location.reload();
    } else {
      alert("Login failed");
    }
  }
}