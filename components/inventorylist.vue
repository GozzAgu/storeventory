<script setup lang="ts">
import { ref } from 'vue';

// Sample data for inventory
const receipts = ref([
  {
    receiptNumber: 'INV001',
    customerName: 'John Doe',
    total: 150.5,
    issueDate: new Date().toLocaleDateString(),
  },
  {
    receiptNumber: 'INV002',
    customerName: 'Jane Smith',
    total: 200.0,
    issueDate: new Date().toLocaleDateString(),
  },
]);

function viewDetails(data: any) {
  console.log('Viewing receipt details:', data);
}

function downloadReceipt(data: any) {
  console.log('Downloading receipt:', data);
}

// Export functionality
const dt = ref();
const exportCSV = () => {
  dt.value?.exportCSV();
};
</script>

<template>
  <div class="p-4 md:p-6 max-w-8xl mx-auto">
    <!-- Header Section -->
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg">
      <h2 class="text-2xl font-semibold">Inventory</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        View all products in inventory.
      </p>
    </div>

    <!-- PrimeVue DataTable -->
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg mt-6 overflow-auto">
      <DataTable
        :value="receipts"
        ref="dt"
        responsiveLayout="scroll"
        tableStyle="min-width: 40rem"
        class="p-datatable-gridlines text-xs sm:text-sm"
      >
        <!-- Export Button in Header -->
        <template #header>
          <div class="flex justify-end pb-4">
            <Button
              icon="pi pi-external-link"
              label="Export"
              @click="exportCSV"
              class="p-button-sm sm:w-auto w-full text-xs sm:text-sm"
            />
          </div>
        </template>

        <!-- Table Columns -->
        <Column field="receiptNumber" header="Inventory #" />
        <Column field="customerName" header="Customer" />
        <Column field="total" header="Total" />
        <Column field="issueDate" header="Issued On" />
        <Column header="Actions" bodyStyle="text-align: center">
          <template #body="slotProps">
            <div class="flex gap-2 justify-center sm:justify-start">
              <button
                class="p-button p-button-text p-button-info text-xs sm:text-sm w-full sm:w-auto"
                @click="viewDetails(slotProps.data)"
              >
                View
              </button>
              <button
                class="p-button p-button-text p-button-success text-xs sm:text-sm w-full sm:w-auto"
                @click="downloadReceipt(slotProps.data)"
              >
                Download
              </button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- No Receipts Message -->
    <div v-if="receipts.length === 0" class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg mt-6">
      <p class="text-gray-600 dark:text-gray-400">No receipts generated yet.</p>
    </div>
  </div>
</template>

<style>
/* Define light and dark mode variables */
:root {
  --table-header-bg: #f9f9f9;
  --table-row-bg: #ffffff;
  --table-border-color: #dcdcdc;
  --table-hover-bg: #f5f5f5;
}

.dark {
  --table-header-bg: #333333;
  --table-row-bg: #1e1e1e;
  --table-border-color: #555555;
  --table-hover-bg: #2c2c2c;
}

/* DataTable Styles */
.p-datatable {
  background-color: transparent;
}

.p-datatable .p-datatable-thead > tr > th {
  background-color: var(--table-header-bg);
  color: var(--text-color, #000);
  border-bottom: 1px solid var(--table-border-color);
}

.p-datatable .p-datatable-tbody > tr > td {
  background-color: var(--table-row-bg);
  color: var(--text-color, #000);
  border-bottom: 1px solid var(--table-border-color);
}

/* Hover Effect */
.p-datatable .p-datatable-tbody > tr:hover {
  background-color: var(--table-hover-bg);
}
</style>