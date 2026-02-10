const API_URL = "https://script.google.com/macros/s/AKfycbwY-upxs48d-zvS0RHwI-ETrdKmP7bsTwQX3e-EF0u0Wpu0FDb6wLcevKz62N-JVkQs/exec";

/* FORM + TABLE */
const form = document.getElementById("dataForm");
const table = document.getElementById("dataTable");

/* INPUTS (EXPLICIT – NO GLOBAL VARS) */
const nameInput = document.getElementById("name");
const roleInput = document.getElementById("role");
const ageInput = document.getElementById("age");
const heightInput = document.getElementById("height");
const birthdayInput = document.getElementById("birthday");
const allergyInput = document.getElementById("allergy");
const conditionInput = document.getElementById("condition");

/* STATE */
let records = [];
let editingRow = null;

/* SUBMIT (CREATE / UPDATE) */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    action: editingRow ? "update" : "create",
    row: editingRow,
    name: nameInput.value,
    role: roleInput.value,
    age: ageInput.value,
    height: heightInput.value,
    birthday: birthdayInput.value,
    allergy: allergyInput.value,
    condition: conditionInput.value
  };

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
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

  if (!data || data.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; opacity:0.6;">
          No records found
        </td>
      </tr>
    `;
    return;
  }

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

  nameInput.value = r.name || "";
  roleInput.value = r.role || "";
  ageInput.value = r.age || "";
  heightInput.value = r.height || "";
  birthdayInput.value = r.birthday ? r.birthday.split("T")[0] : "";
  allergyInput.value = r.allergy || "";
  conditionInput.value = r.condition || "";
}

/* DELETE */
async function deleteRow(row) {
  if (!row) {
    alert("Row number missing.");
    return;
  }

  if (!confirm("Delete this record?")) return;

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "delete",
      row: row
    })
  });

  loadData();
}

/* HELPERS */
function formatDate(dateStr) {
  if (!dateStr) return "";
  return dateStr.split("T")[0];
}

function formatDateTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString();
}

/* INIT */
loadData();
