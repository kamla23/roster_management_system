const loginForm = document.getElementById("loginForm");
const loginErrors = document.getElementById("loginErrors");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill all fields!");
    return;
  }

  const data = { email, password };

  try {
  const res = await fetch("http://localhost:50000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  loginErrors.innerHTML = "";


  if (!res.ok) {
    const li = document.createElement("li");
    li.textContent = result.message || "Login failed";
    loginErrors.appendChild(li);
    return;
  }

  alert("Login successful!");
  localStorage.setItem("token", result.token);
  window.location.href = "dashboard.html";

} catch (err) {
  console.error("Error connecting to backend:", err);
  alert("Server error. Try again later.");
}
});