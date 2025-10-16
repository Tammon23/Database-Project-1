function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  console.log("User is logged out");
  window.location.href = "login.html";
}

document.querySelector("#logout-btn").onclick = logout;
