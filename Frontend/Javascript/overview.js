
let duties = JSON.parse(localStorage.getItem("duties")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = { role: "Admin", name: "Kittu" }; 

function loadChartJsAndInit() {
    if (typeof Chart === "undefined") {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/chart.js";
        script.onload = () => {
            updateDashboard();
        };
        document.head.appendChild(script);
    } else {
        updateDashboard();
    }
}

let myChart;

loadChartJsAndInit();

function updateDashboard() {

    if (typeof Chart === "undefined") {
        setTimeout(updateDashboard, 100);
        return;
    }

    const selectedMonth = document.getElementById("monthPicker").value;
    
    const monthlyDuties = duties.filter(d => d.date.startsWith(selectedMonth));
    
    let displayData = (currentUser.role === "Admin") 
        ? monthlyDuties 
        : monthlyDuties.filter(d => d.user === currentUser.name);

    const stats = {
        total: displayData.length,
        completed: displayData.filter(d => d.status === "Completed").length,
        pending: displayData.filter(d => d.status === "Pending").length,
        skipped: displayData.filter(d => d.status === "Skipped").length
    };

    document.getElementById("totalDuties").innerText = stats.total;
    document.getElementById("completedDuties").innerText = stats.completed;
    document.getElementById("pendingDuties").innerText = stats.pending;
    document.getElementById("skippedDuties").innerText = stats.skipped;

    updateChart(stats);
    renderTable(selectedMonth, currentUser.role);
}




function updateChart(stats) {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    if (myChart) myChart.destroy(); 

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending', 'Skipped'],
            datasets: [{
                data: [stats.completed, stats.pending, stats.skipped],
                backgroundColor: ['#48bb78', '#ecc94b', '#f56565'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function renderTable(month, role) {
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = document.getElementById("overviewTableBody");
    tableBody.innerHTML = "";

    if (role === "Admin") {
        tableHeader.innerHTML = `<th>User Name</th><th>Total</th><th>✅ Done</th><th>⏳ Pending</th><th>❌ Skipped</th>`;
        
        users.forEach(user => {
            const uDuties = duties.filter(d => d.user === user.name && d.date.startsWith(month));
            if (uDuties.length > 0) {
                tableBody.innerHTML += `
                    <tr>
                        <td><strong>${user.name}</strong></td>
                        <td>${uDuties.length}</td>
                        <td style="color:green">${uDuties.filter(d=>d.status==="Completed").length}</td>
                        <td style="color:orange">${uDuties.filter(d=>d.status==="Pending").length}</td>
                        <td style="color:red">${uDuties.filter(d=>d.status==="Skipped").length}</td>
                    </tr>`;
            }
        });
    } else {
        document.getElementById("tableTitle").innerText = "My Duty History";
        tableHeader.innerHTML = `<th>Date</th><th>Duty Name</th><th>Status</th>`;
        
        const myDuties = duties.filter(d => d.user === currentUser.name && d.date.startsWith(month));
        myDuties.forEach(d => {
            tableBody.innerHTML += `
                <tr>
                    <td>${d.date}</td>
                    <td>${d.name}</td>
                    <td><strong>${d.status}</strong></td>
                </tr>`;
        });
    }
}

updateDashboard(); 