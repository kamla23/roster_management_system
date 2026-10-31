let users = JSON.parse(localStorage.getItem("users")) || [];

// Saare input elements ko variables mein store kar lo taaki 'undefined' error na aaye
function getInputs() {
    return {
        nameInput: document.getElementById("name"),
        emailInput: document.getElementById("email"),
        passInput: document.getElementById("password"),
        roleInput: document.getElementById("role"),
        statusInput: document.getElementById("status"),
        editIndexInput: document.getElementById("editIndex"),
        searchInput: document.getElementById("search"),
        filterRole: document.getElementById("filterRole"),
        filterStatus: document.getElementById("filterStatus")
    };
}

function openModal(edit = false, index = null) {
    const inputs = getInputs();
    document.getElementById("userModal").style.display = "block";

    if (edit) {
        document.getElementById("modalTitle").innerText = "Edit User";
        inputs.editIndexInput.value = index;

        let user = users[index];
        inputs.nameInput.value = user.name;
        inputs.emailInput.value = user.email;
        inputs.passInput.value = ""; 
        inputs.roleInput.value = user.role;
        inputs.statusInput.value = user.status;
    } else {
        document.getElementById("modalTitle").innerText = "Add User";
        inputs.editIndexInput.value = "";
        inputs.nameInput.value = "";
        inputs.emailInput.value = "";
        inputs.passInput.value = "";
    }
}

// Make openModal available globally for HTML event handlers
window.openModal = openModal;

function closeModal() {
    document.getElementById("userModal").style.display = "none";
}

// Make saveUser available globally for HTML event handlers
function saveUser() {
    const inputs = getInputs();

    // trim() use karne se pehle check karna zaroori hai
    let nameVal = inputs.nameInput.value.trim();
    let emailVal = inputs.emailInput.value.trim();
    let passVal = inputs.passInput.value.trim();
    let roleVal = inputs.roleInput.value;
    let statusVal = inputs.statusInput.value;

    if (nameVal === "" || emailVal === "") {
        alert("Name & Email required");
        return;
    }

    let index = inputs.editIndexInput.value;

    const userData = {
        name: nameVal,
        email: emailVal,
        password: passVal,
        role: roleVal,
        status: statusVal
    };

    if (index === "") {
        users.push(userData);
    } else {
        users[index] = userData;
    }

    localStorage.setItem("users", JSON.stringify(users));
    console.log("Data Saved to LocalStorage!"); // Debugging ke liye
    closeModal();
    renderUsers();
}

// Make saveUser available globally for HTML event handlers
window.saveUser = saveUser;

function deleteUser(index) {
    if (confirm("Are you sure you want to delete this user?")) {
        users.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(users));
        renderUsers();
    }
}

// Make deleteUser available globally for HTML event handlers
window.deleteUser = deleteUser;

function renderUsers() {
    const inputs = getInputs();
    let table = document.getElementById("userTable");
    table.innerHTML = "";

    let searchVal = inputs.searchInput.value.toLowerCase();
    let roleFilter = inputs.filterRole.value;
    let statusFilter = inputs.filterStatus.value;

    users.forEach((user, index) => {
        if (
            (user.name.toLowerCase().includes(searchVal) ||
             user.email.toLowerCase().includes(searchVal)) &&
            (roleFilter === "" || user.role === roleFilter) &&
            (statusFilter === "" || user.status === statusFilter)
        ) {
            table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td><span class="status-tag ${user.status.toLowerCase()}">${user.status}</span></td>
                <td>
                    <button class="edit-btn" onclick="openModal(true, ${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteUser(${index})">Delete</button>
                </td>
            </tr>`;
        }
    });
}

// Initial Listeners for Search & Filter
document.getElementById("search").addEventListener("keyup", renderUsers);
document.getElementById("filterRole").addEventListener("change", renderUsers);
document.getElementById("filterStatus").addEventListener("change", renderUsers);

renderUsers();