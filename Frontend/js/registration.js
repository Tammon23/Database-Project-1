// when the addBtn is clicked
const addBtn = document.querySelector("#register-btn");
addBtn.onclick = async function () {
  const registration_fields = document.querySelectorAll(
    ".auth-box input[required]"
  );
  let all_fields_filled = true;

  registration_fields.forEach((field) => {
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
  registration_fields.forEach(
    (field) => (content[field.name] = field.value.trim())
  );

  try {
    const response = await fetch("http://localhost:5050/register", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(content),
    });

    const result = await response.json();
    if (response.ok && result.success) window.location.href = "login.html";
    else alert(result.message || "Registration failed. Please try again.");
  } catch (error) {
    console.log("Error:", error);
    alert(
      "An unexpected issued occured during registration. Please try again."
    );
  }
};
