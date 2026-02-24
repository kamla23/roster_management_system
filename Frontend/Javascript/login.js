
let form = document.querySelector('form');

form.onsubmit = function(event) {
  event.preventDefault(); 
  let email = document.querySelector('input[type="email"]').value.trim();
  let password = document.querySelector('input[type="password"]').value;


  if(email === "" || password === "") {
    alert("Please fill all fields!");
    return;
  }


  alert("Login Successful!\nEmail: " + email);

  form.reset(); 
};