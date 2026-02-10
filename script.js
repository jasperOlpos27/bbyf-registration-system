const API_URL = "https://script.google.com/macros/s/AKfycbwY-upxs48d-zvS0RHwI-ETrdKmP7bsTwQX3e-EF0u0Wpu0FDb6wLcevKz62N-JVkQs/exec";

/* =========================
   ELEMENT REFERENCES
========================= */
const form = document.getElementById("dataForm");
const table = document.getElementById("dataTable");

const nameInput = document.getElementById("name");
const roleInput = document.getElementById("role");
const ageInput = document.getElementById("age");
const heightInput = document.getElementById("height");
const birthdayInput = document.getElementById("birthday");
const allergyInput = document.getElementById("allergy");
const conditionInput = document.getElementById("condition");

/* =========================
   STATE
========================= */
let records = [];
let editingRow = null;

/* =========================
   FORM SUBMIT
========================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // HARD GUARD — ensures update really happens
  const isUpdate = editingRow !== null && !isNaN(editingRow);

  const payload = {
    action: isUpdate ? "update" : "create",
    row: isUpdate ? Number(editingRow) : null,
    name: nameInput.value.trim(),
    role: roleInput.value.trim(),
    age: ageInput.value,
    height: heightInput.value,
    birthday: birthdayInput.value,
    allergy: allergyInput.value.trim(),
    condition: conditionInput.value.trim()
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

/* =========================
   LOAD DATA
========================= */
async function loadData() {
  const res = await fetch(API_URL);
  records = await res.json();
  renderTable();
}

/* =========================
   RENDER TABLE
========================= */
function renderTable() {
  table.innerHTML = "";

  if (!records.length) {
    table.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center;opacity:.6">
          No records found
        </td>
      </tr>
    `;
    return;
  }

  records.forEach((r, index) => {
    table.innerHTML += `
      <tr>
        <td>${safe(r.name)}</td>
        <td>${safe(r.role)}</td>
        <td>${safe(r.age)}</td>
        <td>${safe(r.height)}</td>
        <td>${formatDate(r.birthday)}</td>
        <td>${safe(r.allergy)}</td>
        <td>${safe(r.condition)}</td>
        <td>${formatDateTime(r.date)}</td>
        <td>
          <button onclick="editRow(${index})">Edit</button>
          <button onclick="deleteRow(${Number(r.row)})">Delete</button>
        </td>
      </tr>
    `;
  });
}

/* =========================
   EDIT
========================= */
function editRow(index) {
  const r = records[index];

  // FORCE number — this fixes your save issue
  editingRow = Number(r.row);

  nameInput.value = r.name || "";
  roleInput.value = r.role || "";
  ageInput.value = r.age || "";
  heightInput.value = r.height || "";
  birthdayInput.value = r.birthday ? r.birthday.split("T")[0] : "";
  allergyInput.value = r.allergy || "";
  conditionInput.value = r.condition || "";
}

/* =========================
   DELETE
========================= */
async function deleteRow(row) {
  if (!row || isNaN(row)) {
    alert("Invalid row number");
    return;
  }

  if (!confirm("Delete this record?")) return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "delete",
      row: Number(row)
    })
  });

  loadData();
}

/* =========================
   HELPERS
========================= */
function safe(v) {
  return v ?? "";
}

function formatDate(d) {
  if (!d) return "";
  return d.split("T")[0];
}

function formatDateTime(d) {
  if (!d) return "";
  return new Date(d).toLocaleString();
}

/* =========================
   INIT
========================= */
loadData();
