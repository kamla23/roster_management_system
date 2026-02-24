
fetch("../html/dashboard.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("dashboard").innerHTML = data;
  });