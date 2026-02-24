// Select the form using ID
var form = document.getElementById("signupForm");

// Add submit event listener
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Stop default form submission

  // Get values
  var fullName = document.getElementById("fullName").value.trim();
  var email = document.getElementById("email").value.trim();
  var password = document.getElementById("password").value.trim();
  var confirmPassword = document.getElementById("confirmPassword").value.trim();
  var role = document.getElementById("role").value;

  // Check empty fields
  if (
    fullName === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    alert("Please fill all fields!");
    return;
  }

  // Check password match
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Success
  alert("Signup Successful!");

  // Redirect to login page
  window.location.href = "login.html";
});