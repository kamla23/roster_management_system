const form = document.getElementById("signupForm");
const errorsList = document.getElementById("errors");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const role = document.getElementById("role").value.trim();



document.addEventListener("DOMContentLoaded", function () {

//   const toggleIcons = document.querySelectorAll(".togglePassword");

//   toggleIcons.forEach(icon => {
//     icon.addEventListener("click", function () {

//       const targetId = this.getAttribute("data-target");
//       const input = document.getElementById(targetId);

//       if (!input) return;

//       if (input.type === "password") {
//         input.type = "text";  
//         this.classList.remove("fa-eye");
//         this.classList.add("fa-eye-slash");
//       } else {
//         input.type = "password";
//         this.classList.remove("fa-eye-slash");
//         this.classList.add("fa-eye");
//       }

//     });
//   });

// });

  
  if (!fullName || !email || !password || !confirmPassword || !role) {
    alert("Please fill all fields!");
    return;
  }
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }


  const data = { fullName, email, password, role };

  try {
    const res = await fetch("http://localhost:50000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    errorsList.innerHTML = ""; 

    if (result.errors) {
      result.errors.forEach(err => {
        const li = document.createElement("li");
        li.textContent = err;
        errorsList.appendChild(li);
      });
    } else {
      alert("Signup successful!");
      window.location.href = "login.html"; 
    }
  } catch (err) {
    console.error("Error connecting to backend:", err);
    alert("Server error. Try again later.");
  }
});