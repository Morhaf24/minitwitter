if (location.host.includes('localhost')) {
  // Load livereload script if we are on localhost
  document.write(
    '<script src="http://' +
    (location.host || 'localhost').split(':')[0] +
    ':35729/livereload.js?snipver=1"></' +
    'script>'
  )
}

const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
let loginRequest;

loginForm.addEventListener("submit", onLoginFormSubmitted);

function onLoginFormSubmitted(event) {
  event.preventDefault();

  const loginData = {
    username: usernameInput.value,
    password: passwordInput.value
  };

  loginRequest = new XMLHttpRequest();
  loginRequest.open("POST", "http://localhost:4200/login");
  loginRequest.setRequestHeader("Content-Type", "application/json");
  loginRequest.onreadystatechange = onLoginResponse;
  loginRequest.send(JSON.stringify(loginData));
}

function onLoginResponse() {
  if (loginRequest.readyState < 4) {
    const responseStatus = loginRequest.status;
    if (responseStatus === 200) {
      window.location.replace('http://localhost:4200/home.html')
    } else {
      alert("Login failed");
    }
  }
}