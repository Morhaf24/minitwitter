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
      alert("Success");
    } else {
      alert("Login failed");
    }
  }
}

const registerForm = document.getElementById("register-form");
const usernameRegister = document.getElementById("username_register");
const passwordRegisrty = document.getElementById("password_register");
let registerRequest;

registerForm.addEventListener("submit", onLoginFormSubmitted);

function onLoginFormSubmitted(event) {
  event.preventDefault();

  const registerData = {
    username: username_register.value,
    password: password_register.value
  };

  registerRequest = new XMLHttpRequest();
  registerRequest.open("POST", "http://localhost:4200/register");
  registerRequest.setRequestHeader("Content-Type", "application/json");
  registerRequest.onreadystatechange = onRegesrtyResponse;
  registerRequest.send(JSON.stringify(registerData));
}

function onRegesrtyResponse() {
  if (registerRequest.readyState < 4) {
    const responseStatus = registerRequest.status;
    if (responseStatus === 200) {
      alert("Success");
    } else {
      alert("Regestry failed");
    }
  }
}