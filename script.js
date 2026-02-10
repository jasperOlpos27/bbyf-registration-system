const API_URL = "https://script.google.com/macros/s/AKfycbwY-upxs48d-zvS0RHwI-ETrdKmP7bsTwQX3e-EF0u0Wpu0FDb6wLcevKz62N-JVkQs/exec";

const form = document.getElementById("dataForm");
const table = document.getElementById("dataTable");

let records = [];
let editingRow = null;

/* SAVE / UPDATE */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    action: editingRow ? "update" : "create",
    row: editingRow,
    name: name.value,
    role: role.value,
    age: age.value,
    height: height.value,
    birthday: birthday.value,
    allergy: allergy.value,
    condition: condition.value
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  form.reset();
  editingRow = null;
  loadData();
});

/* LOAD DATA */
async function loadData() {
  const res = await fetch(API_URL);
  records = await res.json();
  renderTable(records);
}

/* RENDER TABLE */
function renderTable(data) {
  table.innerHTML = "";

  data.forEach((r, index) => {
    table.innerHTML += `
      <tr>
        <td>${r.name || ""}</td>
        <td>${r.role || ""}</td>
        <td>${r.age || ""}</td>
        <td>${r.height || ""}</td>
        <td>${formatDate(r.birthday)}</td>
        <td>${r.allergy || ""}</td>
        <td>${r.condition || ""}</td>
        <td>${formatDateTime(r.date)}</td>
        <td>
          <button onclick="editRow(${index})">Edit</button>
          <button onclick="deleteRow(${r.row})">Delete</button>
        </td>
      </tr>
    `;
  });
}

/* EDIT */
function editRow(index) {
  const r = records[index];

  editingRow = r.row;

  name.value = r.name || "";
  role.value = r.role || "";
  age.value = r.age || "";
  height.value = r.height || "";
  birthday.value = r.birthday ? r.birthday.split("T")[0] : "";
  allergy.value = r.allergy || "";
  condition.value = r.condition || "";
}

/* DELETE */
async function deleteRow(row) {
  if (!confirm("Delete this record?")) return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "delete",
      row
    })
  });

  loadData();
}

/* HELPERS */
function formatDate(d) {
  if (!d) return "";
  return d.split("T")[0];
}

function formatDateTime(d) {
  if (!d) return "";
  return new Date(d).toLocaleString();
}

/* INIT */
loadData();
