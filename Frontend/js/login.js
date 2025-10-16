// when the addBtn is clicked
const addBtn = document.querySelector("#log-in-btn");
addBtn.onclick = function () {
  const log_in_fields = document.querySelectorAll(".auth-box input[required]");
  let all_fields_filled = true;

  // make sure all fields are entered, if not highlight the un filled box
  // and alert the user
  log_in_fields.forEach((field) => {
    if (!field.value.trim()) {
      all_fields_filled = false;
      field.style.borderBottom = "2px solid red";
    } else {
      field.style.borderBottom = "";
    }
  });

  if (!all_fields_filled) {
    alert("All fields must be filled!");
    return;
  }

  // Extract values normally
  const content = {};
  log_in_fields.forEach((field) => (content[field.name] = field.value.trim()));

  Boolean;
  fetch("http://localhost:5050/login", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(content),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Login successful!");

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username);

        window.location.href = "index.html";
      } else {
        alert("Incorrect username or password. Please try again.");
      }
    })

    .catch((error) => {
      console.error("Error during login attempt:", error);
    });
};

// TODO Add it so if you go back to a login/registration page it clears the fields
