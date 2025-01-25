<script setup lang="ts">
import { useInvStore } from '@/stores/inventory'; // Import the store

const product = ref({
  name: '',
  description: '',
  category: '',
  price: '',
  color: '',
  size: '',
  grade: '',
  swapIn: '',
  serialNumber: '',
  supplier: '',
  dateIn: '',
  dateOut: ''
});

const store = useInvStore();

const addInventory = async () => {
  isAddingInventory.value = true; // Start loading
  try {
    const newProduct = {
      name: product.value.name,
      description: product.value.description,
      category: product.value.category,
      price: parseFloat(product.value.price),
      color: product.value.color,
      size: product.value.size,
      grade: product.value.grade,
      swapIn: product.value.swapIn,
      serialNumber: product.value.serialNumber,
      supplier: product.value.supplier,
      dateIn: 'today',
      dateOut: 'today'
    };

    await store.addInventoryItem(newProduct);

    product.value = {
      name: '',
      description: '',
      category: '',
      price: '',
      color: '',
      size: '',
      grade: '',
      swapIn: '',
      serialNumber: '',
      supplier: '',
      dateIn: '',
      dateOut: ''
    };

    addDrawerVisible.value = false; // Close the drawer
  } catch (error) {
    console.error('Error adding inventory:', error);
  } finally {
    isAddingInventory.value = false; // End loading
  }
};

const addDrawerVisible = ref(false);
const isDarkMode = useState('isDarkMode');
const currentPage = ref(1);
const itemsPerPage = ref(30);
const isAddingInventory= ref(false);
// const searchQuery = ref('');

const drawerBackgroundColor = computed(() => {
  return isDarkMode.value ? '#201F2A' : '#E3E4EB';
});

const calculateIndex = (index: any) => {
  return (currentPage.value - 1) * itemsPerPage.value + index + 1;
};

const paginatedInventory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return store.inventory.slice(start, end);
});

const openCreateInventoryDrawer = () => {
  addDrawerVisible.value = true;
};

const exportCSV = () => {
  const csvContent = [
    ['INV ID', 'Customer', 'Total', 'Issued On'], 
    ...store.inventory.map(inv => [
      inv.name,
      inv.description,
      inv.category,
      inv.price,
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

onMounted(async() => {
  await store.fetchInventory();
});
</script>

<template>
  <div class="space-y-8 md:p-6 max-w-full mx-auto">
    <Drawer v-model:visible="addDrawerVisible" position="right" :style="{ backgroundColor: drawerBackgroundColor, width: '400px' }">
      <h3 class="text-xl font-semibold text-gray-600 dark:text-gray-400">Add New Inventory</h3>
      <form @submit.prevent="addInventory" class="space-y-4 mt-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Product name</label>
          <input 
          id="name" 
          v-model="product.name" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md" 
          placeholder="Enter product" required
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
           />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
          <input 
          id="name" 
          v-model="product.description" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md" 
          placeholder="Enter description" required
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
           />
        </div>
        <div>
          <label for="name" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Category</label>
          <input 
          id="name" 
          v-model="product.category" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md" 
          placeholder="Enter category" required
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
           />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Price</label>
          <input 
          id="name" 
          v-model="product.price" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md" 
          placeholder="Enter price" required
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
           />
        </div>
        <div>
          <label for="name" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Color</label>
          <input 
          id="name" 
          v-model="product.color" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md" 
          placeholder="Enter color" required
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
           />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Size</label>
          <input 
          id="name" 
          v-model="product.size" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md" 
          placeholder="Enter size" required
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
           />
        </div>
        <div>
          <label for="name" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Grade</label>
          <input 
          id="name" 
          v-model="product.grade" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md" 
          placeholder="Enter grade" required
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
           />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Swap ?</label>
          <input 
          id="name" 
          v-model="product.swapIn" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md" 
          placeholder="Enter swap" required
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
           />
        </div>
        <div>
          <label for="name" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Serial No</label>
          <input 
          id="name" 
          v-model="product.serialNumber" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md" 
          placeholder="Enter Serial No" required
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
           />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Supplier</label>
          <input 
          id="name" 
          v-model="product.supplier" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md" 
          placeholder="Enter supplier" required
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
           />
        </div>

        <div class="flex justify-end space-x-4 mt-4 fixed bottom-2 right-4">
          <button type="button" @click="addDrawerVisible = false" class="text-gray-500 hover:text-gray-600 -mt-2">Cancel</button>
          <button
            type="submit"
            :disabled="isAddingInventory"
            class="p-2 rounded-md shadow-md mb-4 flex items-center justify-center gap-2 transition-all duration-300"
            style="background-color: #4c5270; color: white; border-color: #4c5270;"
          >
            <i v-if="isAddingInventory" class="pi pi-spin pi-spinner"></i>
            {{ isAddingInventory ? 'Adding...' : 'Add Inventory' }}
          </button>
        </div>
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
          <div v-if="store.inventory.length === 0" class="flex flex-col items-center justify-center h-full space-y-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 10h11M9 21H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v7m-5 9l5-5m0 0l-5-5m5 5H9"
              />
            </svg>
            <p class="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              No inventory data available. Add new items to get started.
            </p>
            <button 
              @click="openCreateInventoryDrawer"
              style="background-color: #4c5270; color: white; border-color: #4c5270;"
              class="text-xs md:text-base p-2 rounded-md shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-300">
              <i class="text-xs md:text-base pi pi-plus"></i> Add 
            </button>
          </div>

          <table v-else class="min-w-full border border-gray-300 dark:border-gray-600 text-xs md:text-sm">
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
                v-for="(inventory, index) in paginatedInventory" 
                :key="index" 
                class="hover:bg-light-bg hover:dark:bg-dark-bg">
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ calculateIndex(index) }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap sticky left-0 z-10 bg-lighter-bg dark:bg-darker-bg">{{ inventory.id }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.name }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.description }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.category }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.price }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.color }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.size }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.grade }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.swapIn }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.serialNumber }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.supplier }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.dateIn }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.dateOut }}</td>
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
          Page {{ currentPage }} of {{ Math.ceil(store.inventory.length / itemsPerPage) }}
        </span>
        <button 
          @click="currentPage * itemsPerPage < store.inventory.length && (currentPage++)"
          :disabled="currentPage * itemsPerPage >= store.inventory.length"
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