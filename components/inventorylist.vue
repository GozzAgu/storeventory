<script setup lang="ts">
import { ref } from 'vue';

const size = ref({ label: 'Small', value: 'null' });
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

const dt = ref();
const exportCSV = () => {
  dt.value?.exportCSV();
};
</script>

<template>
  <div class="space-y-8 md:p-6 max-w-full mx-auto">
    <!-- Header Section -->
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg min-w-[5rem]">
      <h2 class="text-2xl font-semibold">Inventory</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        View all products in inventory.
      </p>
    </div>

    <!-- Responsive DataTable Container -->
    <div class="w-full overflow-x-auto">
      <DataTable
        :value="receipts"
        ref="dt"
        tableStyle="width: 100%; table-layout: auto;"
      >
        <template #header>
          <div class="text-end pb-4">
            <Button icon="pi pi-external-link" label="Export" @click="exportCSV()" />
          </div>
        </template>
        <Column field="receiptNumber" header="Inventory" style="min-width: 150px;" />
        <Column field="customerName" header="Customer" style="min-width: 150px;" />
        <Column field="total" header="Total" style="min-width: 100px;" />
        <Column field="issueDate" header="Issued On" style="min-width: 150px;" />
        <Column field="receiptNumber" header="Inventory" style="min-width: 150px;" />
        <Column field="customerName" header="Customer" style="min-width: 150px;" />
        <Column field="total" header="Total" style="min-width: 100px;" />
        <Column field="issueDate" header="Issued On" style="min-width: 150px;" />
        <Column field="receiptNumber" header="Inventory" style="min-width: 150px;" />
        <Column field="customerName" header="Customer" style="min-width: 150px;" />
        <Column field="total" header="Total" style="min-width: 100px;" />
        <Column field="issueDate" header="Issued On" style="min-width: 150px;" />
        <Column field="receiptNumber" header="Inventory" style="min-width: 150px;" />
        <Column field="customerName" header="Customer" style="min-width: 150px;" />
        <Column field="total" header="Total" style="min-width: 100px;" />
        <Column field="issueDate" header="Issued On" style="min-width: 150px;" />
      </DataTable>
    </div>
  </div>
</template>


<style>
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

.overflow-x-auto {
  overflow-x: auto;
}

.p-datatable {
  background-color: transparent;
  width: 100%;
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
  white-space: nowrap; /* Prevent text wrapping */
  text-overflow: ellipsis;
  overflow: hidden;
}

.p-datatable .p-datatable-tbody > tr:hover {
  background-color: var(--table-hover-bg);
}

@media screen and (max-width: 580px) {
  .p-datatable {
    font-size: 12px;
  }

  .p-datatable .p-datatable-tbody .p-button {
    width: 100%;
    margin-bottom: 8px;
  }
}

.p-datatable .p-datatable-tbody > tr {
  height: 48px; /* Adjust the height as needed */
}
</style>