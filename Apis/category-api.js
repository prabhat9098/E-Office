const API_BASE = "http://localhost:5000/api/manage"; // Change to your server URL

document.addEventListener("DOMContentLoaded", () => {
  loadAll();

  document.getElementById("categoryForm").onsubmit = (e) => {
    e.preventDefault();
    addItem("category", document.getElementById("categoryInput").value);
  };
  document.getElementById("departmentForm").onsubmit = (e) => {
    e.preventDefault();
    addItem("department", document.getElementById("departmentInput").value);
  };
  document.getElementById("applicationForm").onsubmit = (e) => {
    e.preventDefault();
    addItem("applicationType", document.getElementById("applicationInput").value);
  };
});

async function addItem(type, value) {
  if (!value.trim()) return;
  await fetch(`${API_BASE}/${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  loadAll();
}

async function updateItem(type, id, newValue) {
  await fetch(`${API_BASE}/${type}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value: newValue }),
  });
  loadAll();
}

async function deleteItem(type, id) {
  if (!confirm("Are you sure?")) return;
  await fetch(`${API_BASE}/${type}/${id}`, { method: "DELETE" });
  loadAll();
}

async function loadAll() {
  loadItems("category", "categoryTable");
  loadItems("department", "departmentTable");
  loadItems("applicationType", "applicationTable");
}

async function loadItems(type, tableId) {
  const res = await fetch(`${API_BASE}/${type}`);
  const data = await res.json();
  const tbody = document.querySelector(`#${tableId} tbody`);
  tbody.innerHTML = "";
  data.forEach((item, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td contenteditable="true" onblur="updateItem('${type}', '${item._id}', this.textContent.trim())">${item.value}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteItem('${type}', '${item._id}')">Delete</button></td>
    `;
    tbody.appendChild(row);
  });
}
