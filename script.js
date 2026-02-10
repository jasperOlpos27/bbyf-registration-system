const SPREADSHEET_ID = "1vowv0ktHTMrS_5_0R8o3VEWS-029sTOvU0h7GQkk3W8";
const SHEET_NAME = "Data"; // or "Data" if you renamed it

function getSheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
}

/* CREATE */
function doPost(e) {
  const sheet = getSheet();
  const data = JSON.parse(e.postData.contents);

  if (data.action === "update") {
    const row = data.row;
    sheet.getRange(row, 1, 1, 7).setValues([[
      data.name,
      data.role,
      data.age,
      data.height,
      data.birthday,
      data.allergy,
      data.condition
    ]]);

    return output({ success: true });
  }

  if (data.action === "delete") {
    sheet.deleteRow(data.row);
    return output({ success: true });
  }

  // CREATE
  sheet.appendRow([
    data.name,
    data.role,
    data.age,
    data.height,
    data.birthday,
    data.allergy,
    data.condition,
    new Date()
  ]);

  return output({ success: true });
}

/* READ */
function doGet() {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  rows.shift();

  const records = rows.map((r, i) => ({
    row: i + 2, // actual row number in sheet
    name: r[0],
    role: r[1],
    age: r[2],
    height: r[3],
    birthday: r[4],
    allergy: r[5],
    condition: r[6],
    date: r[7]
  }));

  return output(records);
}

function output(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
