// LocalStorage se data load karna
let requests = JSON.parse(localStorage.getItem("requests")) || [];
let duties = JSON.parse(localStorage.getItem("duties")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [{name: "Rahul"}, {name: "Sita"}];

// View Toggle Logic
function switchView(view) {
    document.getElementById('userSection').style.display = (view === 'user') ? 'block' : 'none';
    document.getElementById('adminSection').style.display = (view === 'admin') ? 'block' : 'none';
    renderAll();
}

function toggleSwapUser(show) {
    document.getElementById('swapUserField').style.display = show ? 'block' : 'none';
}

// 🟢 Dropdowns Bharna
function populateDropdowns() {
    const dutySelect = document.getElementById("userDuties");
    const userSelect = document.getElementById("allUsersList");

    // Upcoming Duties (Sirf user ki apni duties dikhane ke liye - yahan demo ke liye sab hai)
    dutySelect.innerHTML = duties.map(d => `<option value="${d.name}|${d.date}">${d.name} (${d.date})</option>`).join("");
    
    // Swap ke liye users list
    userSelect.innerHTML = users.map(u => `<option value="${u.name}">${u.name}</option>`).join("");
}

// 🟢 Request Submit Karna
document.getElementById("requestForm").onsubmit = function(e) {
    e.preventDefault();
    
    const dutyInfo = document.getElementById("userDuties").value.split('|');
    const type = document.querySelector('input[name="reqType"]:checked').value;
    const swapUser = type === "Swap" ? document.getElementById("allUsersList").value : null;
    const reason = document.getElementById("requestReason").value;

    const newRequest = {
        id: Date.now(),
        userName: "CurrentUser", // Real mein login se aayega
        dutyName: dutyInfo[0],
        date: dutyInfo[1],
        type: type,
        swapWith: swapUser,
        reason: reason,
        status: "Pending"
    };

    requests.push(newRequest);
    localStorage.setItem("requests", JSON.stringify(requests));
    
    alert("Request submitted successfully!");
    this.reset();
    renderAll();
};

// 🟢 Render Tables
function renderAll() {
    const userTable = document.getElementById("myRequestsTable");
    const adminTable = document.getElementById("adminRequestsTable");

    userTable.innerHTML = "";
    adminTable.innerHTML = "";

    requests.forEach((req, index) => {
        const badgeClass = req.status.toLowerCase();
        
        // User Table
        userTable.innerHTML += `
            <tr>
                <td>${req.dutyName}</td>
                <td>${req.date}</td>
                <td>${req.type}</td>
                <td><span class="badge ${badgeClass}">${req.status}</span></td>
            </tr>`;

        // Admin Table
        adminTable.innerHTML += `
            <tr>
                <td>${req.userName}</td>
                <td>${req.dutyName}</td>
                <td>${req.type} ${req.swapWith ? '-> '+req.swapWith : ''}</td>
                <td>${req.reason}</td>
                <td><span class="badge ${badgeClass}">${req.status}</span></td>
                <td>
                    ${req.status === "Pending" ? `
                        <button onclick="updateStatus(${req.id}, 'Approved')" class="approve-btn">Approve</button>
                        <button onclick="updateStatus(${req.id}, 'Rejected')" class="reject-btn">Reject</button>
                    ` : 'Processed'}
                </td>
            </tr>`;
    });
}

// 🟢 Admin Logic: Approve / Reject
function updateStatus(reqId, newStatus) {
    const reqIndex = requests.findIndex(r => r.id === reqId);
    if (reqIndex === -1) return;

    const req = requests[reqIndex];
    req.status = newStatus;

    if (newStatus === "Approved") {
        // Duty Table ko update karne ka logic
        const dutyIndex = duties.findIndex(d => d.name === req.dutyName && d.date === req.date);
        
        if (dutyIndex !== -1) {
            if (req.type === "Skip") {
                duties[dutyIndex].status = "Skipped";
            } else if (req.type === "Swap") {
                duties[dutyIndex].user = req.swapWith;
            }
            localStorage.setItem("duties", JSON.stringify(duties));
        }
    }

    localStorage.setItem("requests", JSON.stringify(requests));
    renderAll();
    alert(`Request ${newStatus}!`);
}

// Initial Load
populateDropdowns();
renderAll();