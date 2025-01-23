<template>
  <div class="container">
    <h1>Excel Import/Export</h1>

    <!-- File Import -->
    <div class="file-import">
      <label for="fileInput" class="label">Import Excel:</label>
      <input id="fileInput" type="file" @change="onFileInputChange" class="input" />
    </div>

    <!-- Editable Headers Section -->
    <div v-if="headers.length > 0" class="customize-section">
      <h3>Customize Table</h3>
      <div v-for="(header, index) in headers" :key="index" class="header-input">
        <label>Column {{ index + 1 }}</label>
        <input
          type="text"
          v-model="headers[index]"
          placeholder="Enter custom header"
          class="input"
        />
      </div>
      <button @click="addNewColumn" class="button primary">Add Column</button>
    </div>

    <!-- Export Button -->
    <div class="actions">
      <button @click="exportToExcel" class="button primary">Export Table</button>
    </div>

    <!-- Table Display -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
            <td v-for="(value, colIndex) in headers" :key="colIndex">
              <input
                type="text"
                v-model="tableData[rowIndex][colIndex]"
                :placeholder="headers[colIndex] || 'New Column'"
                class="input cell-input"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import { ref } from "vue";

export default {
  setup() {
    const headers = ref([]);
    const tableData = ref([]);

    const onFileInputChange = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
        });

        if (sheet.length > 0) {
          headers.value = sheet[0];
          tableData.value = sheet.slice(1).map((row) => Array.isArray(row) ? row : []);
        }
      };

      reader.readAsArrayBuffer(file);
    };

    const exportToExcel = () => {
      const dataForExport = [headers.value, ...tableData.value.map((row) => {
        return headers.value.map((_, index) => row[index] || "");
      })];

      const ws = XLSX.utils.aoa_to_sheet(dataForExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, ws, "Sheet1");

      XLSX.writeFile(workbook, "custom-table-data.xlsx");
    };

    const addNewColumn = () => {
      headers.value.push(`Column ${headers.value.length + 1}`);
      tableData.value = tableData.value.map((row) => {
        row.push("");
        return row;
      });
    };

    return {
      headers,
      tableData,
      onFileInputChange,
      exportToExcel,
      addNewColumn,
    };
  },
};
</script>

<style>
:root {
  --primary-color: #4caf50;
  --secondary-color: #333;
  --light-gray: #f5f5f5;
  --border-color: #ddd;
  --hover-color: #45a049;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  color: var(--secondary-color);
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 24px;
  color: var(--primary-color);
}

.file-import,
.customize-section,
.actions {
  margin-bottom: 16px;
}

.label {
  font-weight: bold;
}

.input {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  width: 100%;
  margin-top: 8px;
  box-sizing: border-box;
}

.header-input {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.header-input label {
  width: 120px;
  font-weight: bold;
}

.button {
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button.primary {
  background-color: var(--primary-color);
  color: white;
}

.button.primary:hover {
  background-color: var(--hover-color);
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

th {
  background-color: var(--primary-color);
  color: white;
  padding: 12px;
  text-align: left;
  border: 1px solid var(--border-color);
}

td {
  padding: 12px;
  text-align: left;
  border: 1px solid var(--border-color);
  white-space: nowrap;
}

.cell-input {
  width: 100%;
  border: none;
  outline: none;
  background-color: transparent;
}

tr:nth-child(even) {
  background-color: var(--light-gray);
}

tr:hover {
  background-color: #f1f1f1;
}
</style>