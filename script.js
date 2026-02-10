const API_URL = "https://script.google.com/macros/s/AKfycbwLmJaaCMTFJiahfX7xJ-gts0M-UKdCWHrxRJnbMvhe92Wqj6NKnpl99Y-svuJhP6tv/exec";

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

/* SAVE DATA */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const record = {
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
    body: JSON.stringify(record)
  });

  form.reset();
  loadData();
});

/* LOAD SHARED DATA */
async function loadData() {
  const res = await fetch(API_URL);
  const records = await res.json();

  renderTable(records);
}

/* SEARCH */
searchInput.addEventListener("input", async () => {
  const keyword = searchInput.value.toLowerCase();
  const res = await fetch(API_URL);
  const records = await res.json();

  const filtered = records.filter(r =>
    Object.values(r).some(v =>
      String(v).toLowerCase().includes(keyword)
    )
  );

  renderTable(filtered);
});

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

  data.forEach(r => {
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
      </tr>
    `;
  });
}

/* INITIAL LOAD */
loadData();

