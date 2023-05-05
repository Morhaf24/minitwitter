const usernameButton = document.getElementById("edit_user_admin");
const usernameInput = document.getElementById("user_input");
const roleButton = document.getElementById("edit_user_admin");
const roleInput = document.getElementById("edit_role_admin");
let usernameRequest;
let roleRequest;

usernameButton.addEventListener("click", onUsernameButtonClicked);

function onUsernameButtonClicked(event) {
    event.preventDefault();

    const usernameData = {
        name: usernameInput.value
    };
    
    usernameRequest = new XMLHttpRequest();
    usernameRequest.open("PUT", "http://localhost:4200/user/" + window.location.hash.substring(1));
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
        alert("Name has been changed");
        window.location.replace('http://localhost:4200/admin.html');
      } else {
        alert("Try again");
      }
}

roleButton.addEventListener("click", onRoleButtonClicked);

function onRoleButtonClicked(event) {
    event.preventDefault();

    const roleData = {
        role: roleInput.value
    };
    
    roleRequest = new XMLHttpRequest();
    roleRequest.open("PUT", "http://localhost:4200/user/" + window.location.hash.substring(1));
    roleRequest.setRequestHeader("Content-Type", "application/json");
    roleRequest.onreadystatechange = onRoleResponse;
    roleRequest.send(JSON.stringify(roleData));
}

function onRoleResponse() {
    if (roleRequest.readyState < 4) {
    return;
    }
      const responseStatus = roleRequest.status;
      if (responseStatus === 200) {
        alert("Name has been changed");
        window.location.replace('http://localhost:4200/admin.html');
      } else {
        alert("Try again");
      }
}