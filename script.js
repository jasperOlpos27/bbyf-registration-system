const form = document.getElementById("dataForm");
const table = document.getElementById("dataTable");
const searchInput = document.getElementById("searchInput");

const nameInput = document.getElementById("name");
const roleInput = document.getElementById("role");
const ageInput = document.getElementById("age");
const heightInput = document.getElementById("height");
const birthdayInput = document.getElementById("birthday");
const allergyInput = document.getElementById("allergy");
const conditionInput = document.getElementById("condition");

let records = JSON.parse(localStorage.getItem("records")) || [];
let editIndex = null;

/* SAVE / UPDATE DATA */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const record = {
    name: nameInput.value.trim(),
    role: roleInput.value.trim(),
    age: ageInput.value.trim(),
    height: heightInput.value.trim(),
    birthday: birthdayInput.value,
    allergy: allergyInput.value.trim(),
    condition: conditionInput.value.trim(),
    date: new Date().toLocaleDateString()
  };

  if (editIndex !== null) {
    records[editIndex] = record; // UPDATE
    editIndex = null;
  } else {
    records.push(record); // CREATE
  }

  localStorage.setItem("records", JSON.stringify(records));
  form.reset();
  renderTable(records);
});

/* SEARCH (ANY FIELD) */
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();

  const filtered = records.filter(r =>
    Object.values(r).some(value =>
      String(value).toLowerCase().includes(keyword)
    )
  );

  renderTable(filtered);
});

/* EDIT RECORD */
function editRecord(index) {
  const r = records[index];

  nameInput.value = r.name;
  roleInput.value = r.role;
  ageInput.value = r.age;
  heightInput.value = r.height;
  birthdayInput.value = r.birthday;
  allergyInput.value = r.allergy;
  conditionInput.value = r.condition;

  editIndex = index;
}

/* DELETE RECORD */
function deleteRecord(index) {
  records.splice(index, 1);
  localStorage.setItem("records", JSON.stringify(records));
  renderTable(records);
}

/* RENDER TABLE */
function renderTable(data) {
  table.innerHTML = "";

  if (data.length === 0) {
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
        <td>${r.name}</td>
        <td>${r.role}</td>
        <td>${r.age}</td>
        <td>${r.height}</td>
        <td>${r.birthday}</td>
        <td>${r.allergy}</td>
        <td>${r.condition}</td>
        <td>${r.date}</td>
        <td>
          <button onclick="editRecord(${index})">Edit</button>
          <button onclick="deleteRecord(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

/* INITIAL LOAD */
renderTable(records);
