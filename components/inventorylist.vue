<script setup lang="ts">
import { ref } from 'vue';

const receipts = ref([
  { receiptNumber: 'INV001', customerName: 'John Doe Samuel Smith', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe Samuel Smith', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV001', customerName: 'John Doe', total: 150.5, issueDate: new Date().toLocaleDateString() },
  { receiptNumber: 'INV002', customerName: 'Jane Smith', total: 200.0, issueDate: new Date().toLocaleDateString() }
]);
const addDrawerVisible = ref(false);
const isDarkMode = useState('isDarkMode');
const currentPage = ref(1);
const itemsPerPage = ref(30);
const searchQuery = ref('');

const drawerBackgroundColor = computed(() => {
  return isDarkMode.value ? '#201F2A' : '#E3E4EB';
});

const calculateIndex = (index: any) => {
  return (currentPage.value - 1) * itemsPerPage.value + index + 1;
};

const paginatedReceipts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return receipts.value.slice(start, end);
});

const openCreateInventoryDrawer = () => {
  addDrawerVisible.value = true;
};

const exportCSV = () => {
  const csvContent = [
    ['INV ID', 'Customer', 'Total', 'Issued On'], 
    ...receipts.value.map(receipt => [
      receipt.receiptNumber,
      receipt.customerName,
      receipt.total.toFixed(2),
      receipt.issueDate
    ])
  ]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'receipts.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<template>
  <div class="space-y-8 md:p-6 max-w-full mx-auto">
    <Drawer v-model:visible="addDrawerVisible" position="right" :style="{ backgroundColor: drawerBackgroundColor, width: '400px' }">
      <h3 class="text-xl font-semibold text-gray-600 dark:text-gray-400">Add New Inventory</h3>
      <form @submit.prevent="" class="space-y-4 mt-4">

      </form>
    </Drawer>
    <!-- Header Section -->
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg">
      <h2 class="text-sm md:text-2xl font-semibold">Inventory</h2>
      <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400">View and manage all products in inventory</p>
    </div>

    <!-- Table Section -->
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg h-[550px] md:h-[770px]">
      <div class="flex justify-between items-center pb-4">
        <h3 class="text-sm md:text-2xl text-dark-text dark:text-light-text">Inventory</h3>
        <div class="flex justify-between items-center mb-4">
          <!-- <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search by INV ID, Customer or Date..." 
            class="text-sm p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full dark:bg-darker-bg dark:text-light-text"
          /> -->
        </div>
        <div class="flex gap-x-2">
          <button 
            @click="exportCSV"
            style="background-color: #4c5270; color: white; border-color: #4c5270;"
            class="text-xs md:text-base p-2 rounded-md shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 transition-all duration-300">
            <i class="text-xs md:text-base pi pi-external-link"></i> Export
          </button>
          <button 
            @click="openCreateInventoryDrawer"
            style="background-color: #4c5270; color: white; border-color: #4c5270;"
            class="text-xs md:text-base p-2 rounded-md shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 transition-all duration-300">
            <i class="text-xs md:text-base pi pi-plus"></i> Add 
          </button>
        </div>
      </div>

      <div class="flex flex-col h-[400px] md:h-[610px]">
        <div class="overflow-x-auto">
          <table class="min-w-full border border-gray-300 dark:border-gray-600 text-xs md:text-sm">
            <thead class="bg-light-bg dark:bg-darker-bg">
              <tr>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">S/N</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap sticky left-0 z-10 bg-light-bg dark:bg-darker-bg">INV ID</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">PRODUCT</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">DESCRIPTION</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">CATEGORY</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">PRICE</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">COLOR</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">SIZE</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">GRADE</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">SWAP IN</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">SERIAL NO</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">SUPPLIER</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">DATE IN</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">DATE OUT</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(receipt, index) in paginatedReceipts" 
                :key="index" 
                class="hover:bg-light-bg hover:dark:bg-dark-bg">
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ calculateIndex(index) }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap sticky left-0 z-10 bg-lighter-bg dark:bg-darker-bg">{{ receipt.receiptNumber }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.customerName }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">${{ receipt.total.toFixed(2) }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.issueDate }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.receiptNumber }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.customerName }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">${{ receipt.total.toFixed(2) }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.issueDate }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.receiptNumber }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.customerName }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">${{ receipt.total.toFixed(2) }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.issueDate }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.receiptNumber }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">
                  <button class="text-blue-500 hover:text-blue-600">Edit</button>
                  <button class="ml-2 text-red-500 hover:text-red-600">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4">
        <button 
          @click="currentPage > 1 && (currentPage--)" :disabled="currentPage === 1"
          class="bg-gray-200 dark:bg-gray-600 text-dark-text dark:text-light-text text-sm px-4 py-2 rounded shadow"
        >
          Previous
        </button>
        <span class="text-gray-600 dark:text-gray-300 text-xs md:text-sm">
          Page {{ currentPage }} of {{ Math.ceil(receipts.length / itemsPerPage) }}
        </span>
        <button 
          @click="currentPage * itemsPerPage < receipts.length && (currentPage++)"
          :disabled="currentPage * itemsPerPage >= receipts.length"
          class="bg-gray-200 dark:bg-gray-600 text-dark-text dark:text-light-text text-sm px-4 py-2 rounded shadow"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --table-header-bg: #CDCFD9;
  --table-row-bg: #ffffff;
  --table-border-color: #dcdcdc;
  --table-hover-bg: #f5f5f5;
}

.dark {
  --table-header-bg: #4D4A63;
  --table-row-bg: #1e1e1e;
  --table-border-color: #555555;
  --table-hover-bg: #2c2c2c;
}

.table-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  overflow: hidden;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
  background-color: var(--table-header-bg);
  padding: 0.5rem 1rem;
  border-top: 1px solid var(--table-border-color);
}
</style>