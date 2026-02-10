const API_URL = "https://script.google.com/macros/s/AKfycbwY-upxs48d-zvS0RHwI-ETrdKmP7bsTwQX3e-EF0u0Wpu0FDb6wLcevKz62N-JVkQs/exec";

const form = document.getElementById("dataForm");
const table = document.getElementById("dataTable");

const nameInput = document.getElementById("name");
const roleInput = document.getElementById("role");
const ageInput = document.getElementById("age");
const heightInput = document.getElementById("height");
const birthdayInput = document.getElementById("birthday");
const allergyInput = document.getElementById("allergy");
const conditionInput = document.getElementById("condition");

let records = [];
let editingRow = null;

/* SUBMIT */
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

  console.log("SUBMIT PAYLOAD:", payload);

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  form.reset();
  editingRow = null;
  loadData();
});

/* LOAD */
async function loadData() {
  const res = await fetch(API_URL);
  records = await res.json();
  renderTable();
}

/* RENDER */
function renderTable() {
  table.innerHTML = "";

  records.forEach((r, i) => {
    table.innerHTML += `
      <tr>
        <td>${r.name}</td>
        <td>${r.role}</td>
        <td>${r.age}</td>
        <td>${r.height}</td>
        <td>${r.birthday}</td>
        <td>${r.allergy}</td>
        <td>${r.condition}</td>
        <td>${r.date}</td>
        <td>
          <button onclick="editRow(${i})">Edit</button>
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

  nameInput.value = r.name;
  roleInput.value = r.role;
  ageInput.value = r.age;
  heightInput.value = r.height;
  birthdayInput.value = r.birthday?.split("T")[0] || "";
  allergyInput.value = r.allergy;
  conditionInput.value = r.condition;
}

/* DELETE */
async function deleteRow(row) {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "delete", row })
  });
  loadData();
}

loadData();
