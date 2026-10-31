// LocalStorage se data uthana
let duties = JSON.parse(localStorage.getItem("duties")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [
    { name: "Rahul" }, { name: "Sita" }, { name: "Amit" }, { name: "Priya" }
];

// User lists ko dropdowns mein bharna
function populateUsers() {
    const assignSelect = document.getElementById("assignUser");
    const filterUser = document.getElementById("filterUser");
    
    const userOptions = users.map(u => `<option value="${u.name}">${u.name}</option>`).join("");
    assignSelect.innerHTML = userOptions;
    filterUser.innerHTML = '<option value="">All Users</option>' + userOptions;
}

// 🟢 Duties dikhana
function renderDuties() {
    const tableBody = document.getElementById("dutyTableBody");
    const searchVal = document.getElementById("searchDuty").value.toLowerCase();
    const dateFilter = document.getElementById("filterDate").value;
    const userFilter = document.getElementById("filterUser").value;
    const statusFilter = document.getElementById("filterStatus").value;

    tableBody.innerHTML = "";

    duties.forEach((duty, index) => {
        if (
            (duty.name.toLowerCase().includes(searchVal)) &&
            (dateFilter === "" || duty.date === dateFilter) &&
            (userFilter === "" || duty.user === userFilter) &&
            (statusFilter === "" || duty.status === statusFilter)
        ) {
            tableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${duty.name}</strong></td>
                    <td>${duty.user}</td>
                    <td>${duty.date}</td>
                    <td><span class="badge ${duty.status.toLowerCase()}">${duty.status}</span></td>
                    <td>
                        <button class="edit-duty-btn" data-index="${index}" style="color:#3182ce; border:none; background:none; cursor:pointer; font-weight:600;">Edit</button>
                        <button class="delete-duty-btn" data-index="${index}" style="color:#e53e3e; border:none; background:none; cursor:pointer; font-weight:600; margin-left:12px;">Delete</button>
                    </td>
                </tr>`;
        }
    });

    // Attach event listeners to edit buttons
    document.querySelectorAll('.edit-duty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            editDuty(this.getAttribute('data-index'));
        });
    });

    // Attach event listeners to delete buttons
    document.querySelectorAll('.delete-duty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteDuty(this.getAttribute('data-index'));
        });
    });
}

// 🟢 Auto-Assign Feature (Smart Feature)
function autoAssignDuties() {
    if (users.length === 0) return alert("Add some users first!");
    
    const tasks = ["Cooking", "Cleaning", "Dishes", "Garbage"];
    const today = new Date().toISOString().split('T')[0];

    tasks.forEach((task, i) => {
        let userIdx = i % users.length; // Rotation logic
        duties.push({
            name: task,
            user: users[userIdx].name,
            date: today,
            status: "Pending"
        });
    });

    localStorage.setItem("duties", JSON.stringify(duties));
    renderDuties();
}

// Example usage: call autoAssignDuties when needed, e.g. on a button click
document.getElementById("autoAssignBtn")?.addEventListener("click", autoAssignDuties);

// Attach saveDuty to the save button
document.getElementById("saveDutyBtn")?.addEventListener("click", saveDuty);

// 🟢 Save / Update
function saveDuty() {
    const name = document.getElementById("dutyName").value;
    const user = document.getElementById("assignUser").value;
    const date = document.getElementById("dutyDate").value;
    const status = document.getElementById("dutyStatus").value;
    const index = document.getElementById("editIndex").value;

    if (!name || !date) return alert("Please fill Name and Date");

    const dutyData = { name, user, date, status };

    if (index === "") duties.push(dutyData);
    else duties[index] = dutyData;

    localStorage.setItem("duties", JSON.stringify(duties));
    closeModal();
    renderDuties();
}

// 🟢 Edit & Delete
function editDuty(index) {
    const d = duties[index];
    document.getElementById("modalTitle").innerText = "Edit Duty";
    document.getElementById("editIndex").value = index;
    document.getElementById("dutyName").value = d.name;
    document.getElementById("assignUser").value = d.user;
    document.getElementById("dutyDate").value = d.date;
    document.getElementById("dutyStatus").value = d.status;
    document.getElementById("dutyModal").style.display = "flex";
}

function deleteDuty(index) {
    if (confirm("Are you sure?")) {
        duties.splice(index, 1);
        localStorage.setItem("duties", JSON.stringify(duties));
        renderDuties();
    }
}

// Modal open/close
// Open modal on button click
document.getElementById("openDutyModalBtn")?.addEventListener("click", function() {
    document.getElementById("dutyModal").style.display = "flex";
    document.getElementById("editIndex").value = "";
    document.getElementById("modalTitle").innerText = "Add New Duty";
});
function closeModal() { document.getElementById("dutyModal").style.display = "none"; }

// Start
populateUsers();
renderDuties();