// =====================================================================
// REAL DATABASE VERSION (No sample data, no localStorage)
// =====================================================================

// Store fetched data
let classesData = [];
let ordersData = [];

// =====================================================================
// CHECK AUTHENTICATION
// =====================================================================
async function checkAuthentication() {
    try {
        const res = await fetch("../backend/check_session.php");
        const data = await res.json();

        if (!data.logged_in) {
            window.location.href = "login.html";
            return false;
        }
        return true;
    } catch (err) {
        console.error("Auth error:", err);
        window.location.href = "login.html";
        return false;
    }
}

// =====================================================================
// FETCH CLASSES FROM DB
// =====================================================================
async function fetchClasses() {
    try {
        const res = await fetch("../backend/get_classes.php");
        const data = await res.json();

        if (data.success) {
            classesData = data.data;
        } else {
            console.error("Failed to load classes");
        }
    } catch (err) {
        console.error("Error fetching classes:", err);
    }
}

// =====================================================================
// FETCH ORDERS FROM DB
// =====================================================================
async function fetchOrders() {
    try {
        const res = await fetch("../backend/get_orders.php");
        const data = await res.json();

        if (data.success) {
            ordersData = data.data;
        } else {
            console.error("Failed to load orders");
        }
    } catch (err) {
        console.error("Error fetching orders:", err);
    }
}

// =====================================================================
// INIT DASHBOARD
// =====================================================================
document.addEventListener("DOMContentLoaded", async () => {
    const ok = await checkAuthentication();
    if (!ok) return;

    await fetchClasses();
    await fetchOrders();

    renderClassesTable();
    renderOrdersTable();
    updateStatistics();
    setupEventListeners();
});

// =====================================================================
// RENDER CLASSES
// =====================================================================
function renderClassesTable(filteredData = null) {
    const tbody = document.getElementById("classesTableBody");
    const emptyState = document.getElementById("classesEmptyState");
    const data = filteredData || classesData;

    tbody.innerHTML = "";

    if (!data.length) {
        emptyState.style.display = "block";
        return;
    }
    emptyState.style.display = "none";

    data.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>#${c.id}</td>
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.phone}</td>
            <td>${formatDate(c.date)}<br><small>${c.time}</small></td>
            <td>${c.session_type}</td>
            <td>${c.art_medium}</td>
            <td>${c.duration}</td>
            <td><span class="status-badge ${c.status}">${c.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewClassDetails(${c.id})"><i class="fas fa-eye"></i> View</button>
                    <button class="action-btn edit" onclick="editClass(${c.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="action-btn delete" onclick="deleteClass(${c.id})"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// =====================================================================
// RENDER ORDERS
// =====================================================================
function renderOrdersTable(filteredData = null) {
    const tbody = document.getElementById("ordersTableBody");
    const emptyState = document.getElementById("ordersEmptyState");
    const data = filteredData || ordersData;

    tbody.innerHTML = "";

    if (!data.length) {
        emptyState.style.display = "block";
        return;
    }
    emptyState.style.display = "none";

    data.forEach(o => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>#ORD${o.id}</td>
            <td>${o.name}</td>
            <td>${o.email}</td>
            <td>${o.phone}</td>
            <td>${o.artwork_type}</td>
            <td>${o.canvas_size}</td>
            <td>${o.art_style}</td>
            <td>${o.urgency}</td>
            <td>${o.budget}</td>
            <td><span class="status-badge ${o.status}">${o.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewOrderDetails(${o.id})"><i class="fas fa-eye"></i> View</button>
                    <button class="action-btn edit" onclick="editOrder(${o.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="action-btn delete" onclick="deleteOrder(${o.id})"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// =====================================================================
// STATS
// =====================================================================
function updateStatistics() {
    document.getElementById("totalClasses").textContent = classesData.length;
    document.getElementById("totalOrders").textContent = ordersData.length;

    document.getElementById("pendingItems").textContent =
        classesData.filter(c => c.status === "pending").length +
        ordersData.filter(o => o.status === "pending").length;

    document.getElementById("completedItems").textContent =
        classesData.filter(c => c.status === "completed").length +
        ordersData.filter(o => o.status === "completed").length;
}

// =====================================================================
// SEARCH / FILTER
// =====================================================================
function setupEventListeners() {
    document.getElementById("classSearch").addEventListener("input", e => {
        const t = e.target.value.toLowerCase();
        renderClassesTable(
            classesData.filter(c => JSON.stringify(c).toLowerCase().includes(t))
        );
    });

    document.getElementById("classFilter").addEventListener("change", e => {
        const val = e.target.value;
        renderClassesTable(
            val === "all" ? classesData : classesData.filter(c => c.status === val)
        );
    });

    document.getElementById("orderSearch").addEventListener("input", e => {
        const t = e.target.value.toLowerCase();
        renderOrdersTable(
            ordersData.filter(o => JSON.stringify(o).toLowerCase().includes(t))
        );
    });

    document.getElementById("orderFilter").addEventListener("change", e => {
        const val = e.target.value;
        renderOrdersTable(
            val === "all" ? ordersData : ordersData.filter(o => o.status === val)
        );
    });
}

// =====================================================================
// PLACEHOLDER ACTIONS
// =====================================================================
function viewClassDetails(id) { alert("Build backend view"); }
function editClass(id) { alert("Build backend edit"); }
function deleteClass(id) { alert("Build backend delete"); }
function viewOrderDetails(id) { alert("Build backend view"); }
function editOrder(id) { alert("Build backend edit"); }
function deleteOrder(id) { alert("Build backend delete"); }

// =====================================================================
// FORMAT DATE
// =====================================================================
function formatDate(d) {
    return new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

// =====================================================================
// LOGOUT
// =====================================================================
async function handleLogout() {
    await fetch("../backend/logout.php");
    window.location.href = "login.html";
}
