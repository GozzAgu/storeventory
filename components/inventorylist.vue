<script setup lang="ts">
import { ref } from 'vue';

const size = ref({ label: 'small', value: 'small' });
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
        scrollable scrollHeight="400px"
        paginator :rows="20" :rowsPerPageOptions="[5, 10, 20, 50]"
        :size="size.value"
        :value="receipts"
        ref="dt"
        tableStyle="width: 100%; table-layout: auto;"
      >
        <div class="flex justify-between items-center pb-4">
          <Button 
            icon="pi pi-external-link" 
            label="Export" 
            @click="exportCSV()" 
          />
        </div>
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
        <Column field="receiptNumber" header="Inventory" style="min-width: 150px;" />
        <Column field="customerName" header="Customer" style="min-width: 150px;" />
        <Column field="total" header="Total" style="min-width: 100px;" />
        <Column field="issueDate" header="Issued On" style="min-width: 150px;" />
        <Column field="receiptNumber" header="Inventory" style="min-width: 150px;" />
        <Column field="customerName" header="Customer" style="min-width: 150px;" />
      </DataTable>
    </div>
  </div>
</template>

<style>
:root {
  --table-header-bg: #CDCFD9; /* Light cyan background for table header */
  --table-row-bg: #ffffff;
  --table-border-color: #dcdcdc;
  --table-hover-bg: #f5f5f5;
  --pagination-bg: #CDCFD9; /* Teal background for pagination */
  --pagination-color: #201F2A; /* White text for pagination */
}

.dark {
  --table-header-bg: #CDCFD9; /* Dark gray background for table header */
  --table-row-bg: #1e1e1e;
  --table-border-color: #555555;
  --table-hover-bg: #2c2c2c;
  --pagination-bg: #004d40; /* Dark teal background for pagination */
  --pagination-color: #ffffff; /* White text for pagination */
}

.p-datatable .p-datatable-thead > tr > th {
  background-color: var(--table-header-bg);
  color: var(--text-color, #000);
  border-bottom: 1px solid var(--table-border-color);
}

.p-datatable .p-paginator {
  background-color: var(--pagination-bg);
  color: var(--pagination-color);
  border-top: 1px solid var(--table-border-color);
}

.p-datatable .p-paginator .p-paginator-page,
.p-datatable .p-paginator .p-paginator-prev,
.p-datatable .p-paginator .p-paginator-next {
  background-color: var(--pagination-bg);
  color: var(--pagination-color);
  border: none;
}

.p-datatable .p-paginator .p-paginator-page.p-highlight {
  background-color: lighten(var(--pagination-bg), 10%);
  color: var(--pagination-color);
}

.p-datatable .p-datatable-tbody > tr > td {
  background-color: var(--table-row-bg);
  color: var(--text-color, #000);
  border-bottom: 1px solid var(--table-border-color);
  white-space: nowrap; /* Prevent text wrapping */
  text-overflow: ellipsis;
  overflow: hidden;
}

/* Webkit-based Browsers (Chrome, Edge, Safari) */
::-webkit-scrollbar {
  width: 10px; /* Scrollbar width */
  height: 10px; /* Horizontal scrollbar height */
}

* {
  scrollbar-color: #a0a0a0 #f3f3f3; /* Thumb color and track color */
  scrollbar-width: thin; /* Thin scrollbar width */
}
</style>