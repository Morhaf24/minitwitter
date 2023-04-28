const registerForm = document.getElementById("register-form");
const usernameRegister = document.getElementById("username_register");
const passwordRegister= document.getElementById("password_register");
let registerRequest;

registerForm.addEventListener("submit", onRegisterFormSubmitted);

function onRegisterFormSubmitted(event) {
  event.preventDefault();

  const registerData = {
    username: usernameRegister.value,
    password: passwordRegister.value
  };

  registerRequest = new XMLHttpRequest();
  registerRequest.open("POST", "http://localhost:4200/register");
  registerRequest.setRequestHeader("Content-Type", "application/json");
  registerRequest.onreadystatechange = onRegisterResponse;
  registerRequest.send(JSON.stringify(registerData));
}

function onRegisterResponse() {
  if (registerRequest.readyState < 4) {
    const responseStatus = registerRequest.status;
    if (responseStatus === 200) {
      alert("Success");
    } else {
      alert("Regestry failed");
    }
  }
}