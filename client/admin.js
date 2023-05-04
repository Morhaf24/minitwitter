const usersTable = document.getElementById("users_table");

let usersRequest = new XMLHttpRequest();
usersRequest.open("GET", "http://localhost:4200/users");
usersRequest.onreadystatechange = onUsersResponsed;
usersRequest.send();


function onUsersResponsed() {
  if (usersRequest.readyState < 4) {
    return;
  }

  responseStatus = usersRequest.status;

  if (responseStatus === 200) {
    let usersResponse = JSON.parse(usersRequest.responseText);

    for (let i = 0; i < usersResponse.length; i++) {
      let usersRow = document.createElement("tr");
      usersTable.appendChild(usersRow);
    
      let idCell = document.createElement("td");
      idCell.innerText = usersResponse[i].id;
      usersRow.appendChild(idCell);
  
      let nameCell = document.createElement("td");
      nameCell.innerText = usersResponse[i].name;
      usersRow.appendChild(nameCell);
  
      let passwordCell = document.createElement("td");
      passwordCell.innerText = usersResponse[i].password;
      usersRow.appendChild(passwordCell);
  
      let roleCell = document.createElement("td");
      roleCell.innerText = usersResponse[i].role;
      usersRow.appendChild(roleCell);
  
      let deleteAndEditCell = document.createElement("td");
      usersRow.appendChild(deleteAndEditCell);
      deleteAndEditCell.className = "delete-and-edit-td";
  
      let deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.className = "edit-and-delete-button";
      deleteButton.setAttribute("delete-user-id", usersResponse[i].id);
      deleteButton.addEventListener("click", onDeleteButtonPressed);
      deleteAndEditCell.appendChild(deleteButton);
    
      let editButton = document.createElement("button");
      editButton.innerText = "Edit";
      editButton.className = "edit-and-delete-button"
      editButton.setAttribute("edit-user-id", usersResponse[i].id);
      editButton.addEventListener("click", onEditButtonPressed);
      deleteAndEditCell.appendChild(editButton);
    }
  }
  else {
    alert("You don't have the power of using this page")
    window.location.replace('http://localhost:4200/home.html')
  }
}


function onDeleteButtonPressed(event) {
  deleteRequest = new XMLHttpRequest();
  deleteRequest.open("Delete", "http://localhost:4200/user/" + event.currentTarget.getAttribute("delete-user-id"));
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
  window.open("admin_edit.html#" + event.currentTarget.getAttribute("edit-user-id"), "_self"); 
  
  }