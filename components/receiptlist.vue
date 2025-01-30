<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useReceiptStore } from '@/stores/receipt';
import { useInvStore } from '@/stores/inventory';
import { ref, computed, onMounted } from 'vue';
import { collection, query, where, getDocs } from "firebase/firestore";

const authStore = useAuthStore();
const store = useReceiptStore();
const invStore = useInvStore();
const addDrawerVisible = ref(false);
const isDarkMode = useState('isDarkMode');
const currentPage = ref(1);
const itemsPerPage = ref(30);
const showCategoryDropdown = ref(false);
const isAddingReceipt = ref(false);
const deleteDialogVisible = ref(false);
const receiptToDelete = ref(null);
const nuxtApp = useNuxtApp();
const itemToDelete = ref(null);

const openCreateReceiptDrawer = () => {
  addDrawerVisible.value = true;
};

const dialogBackgroundColor = computed(() =>
  isDarkMode.value ? '#201F2A' : '#FFFFFF'
);

const modeOfPayment = [
  { name: 'Cash' },
  { name: 'Bank Transfer' },
  { name: 'POS' },
  { name: 'Crypto' },
];

const receipt = ref({
  name: '',
  category: '',
  description: '',
  amount: 0,
  customer: '',
  customerEmail: '',
  customerNumber: '',
  color: '',
  size: '',
  date: '',
  swap: false,
  paidVia: '',
  serialNumber: '',
  receiptNumber: '',
  issuedBy: authStore.currentUser?.email,
  receiptOf: '',
});

type Category = { name: string };
const selectedCategory = ref<Category | null>(null);
const selectCategory = (category: Category | null) => {
  selectedCategory.value = category;
  showCategoryDropdown.value = false;
};

const categories = ref([
  { name: 'Phones'},
  { name: 'Laptops'},
  { name: 'Home Appliances'},
  { name: 'Clothing'},
  { name: 'Others'},
]);

const toggleCategoryDropdown = () => {
  showCategoryDropdown.value = !showCategoryDropdown.value;
};

const deleteReceipt = (receipt: any) => {
  // store.removeReceiptItem(receipt.id);
};

const openDeleteDialog = (inventory: any) => {
  itemToDelete.value = inventory;
  deleteDialogVisible.value = true;
};

const closeDeleteDialog = () => {
  deleteDialogVisible.value = false;
  receiptToDelete.value = null;
};

const addReceipt = async () => {
  if (!authStore.currentUser?.id) {
    console.error('User is not authenticated.');
    alert('Please log in to add receipts.');
    return;
  }

  isAddingReceipt.value = true;
  try {
    let inventoryDetails = {};

    if (receipt.value.serialNumber) {
      const inventoryRef = collection(nuxtApp.$firestore, 'inventory');
      const q = query(inventoryRef, where('serialNumber', '==', receipt.value.serialNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        inventoryDetails = querySnapshot.docs[0].data();
      } else {
        console.warn('No inventory found for serial number:', receipt.value.serialNumber);
        alert('No inventory found for the entered serial number.');
      }
    }

    const receiptOwner = authStore.currentUser?.adminId ?? authStore.currentUser.id;

    const updatedReceipt = {
      name: inventoryDetails.name,
      description: inventoryDetails.description,
      amount: receipt.value.amount,
      customer: receipt.value.customer,
      customerEmail: receipt.value.customerEmail,
      customerNumber: receipt.value.customerNumber,
      category: inventoryDetails.category,
      color: inventoryDetails.color,
      size: inventoryDetails.size,
      date: receipt.value.date,
      swap: inventoryDetails.swapIn,
      paidVia: receipt.value.paidVia,
      serialNumber: inventoryDetails.serialNumber,
      receiptNumber: receipt.value.receiptNumber,
      issuedBy: authStore.currentUser.email,
      receiptOf: receiptOwner,
    };

    await store.addReceipt(updatedReceipt as any);
    await store.fetchReceipts();

    receipt.value = {
      name: '',
      description: '',
      amount: 0,
      category: '',
      customer: '',
      customerEmail: '',
      customerNumber: '',
      color: '',
      size: '',
      date: '',
      swap: false,
      paidVia: '',
      serialNumber: '',
      receiptNumber: '',
      issuedBy: authStore.currentUser?.id,
      receiptOf: '',
    };

    addDrawerVisible.value = false;
  } catch (error) {
    console.error('Error adding receipt:', error);
    alert('Failed to add receipt. Please try again.');
  } finally {
    isAddingReceipt.value = false;
  }
};

const duplicateInventory = (inventory: any) => {
  receipt.value = {
    name: `${inventory.name} (Duplicate)`,
    description: inventory.description,
    category: inventory.category,
    price: inventory.price.toString(),
    color: inventory.color,
    size: inventory.size,
    grade: inventory.grade,
    swapIn: inventory.swapIn,
    serialNumber: inventory.serialNumber,
    supplier: inventory.supplier,
    dateIn: inventory.dateIn,
    dateOut: inventory.dateOut,
    isSold: inventory.isSold,
    inventoryOf: authStore.currentUser?.id,
  };

  addDrawerVisible.value = true;
  receipt.value = { ...inventory, isSold: false };
};

const drawerBackgroundColor = computed(() => {
  return isDarkMode.value ? '#201F2A' : '#E3E4EB';
});

const calculateIndex = (index: any) => {
  return (currentPage.value - 1) * itemsPerPage.value + index + 1;
};

const paginatedInventory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return store.receipts.slice(start, end);
});

const filteredReceipts = computed(() => {
  if (!selectedCategory.value) {
    return paginatedInventory.value;
  }
  return paginatedInventory.value.filter(item => item.category.name === selectedCategory.value?.name);
});

onMounted(async () => {
  if (authStore.currentUser) {
    await store.fetchReceipts();
    await invStore.fetchInventory();
    if (!store.receipts) {
      store.receipts = [];
    }
  } else {
    console.error('No current user found');
  }
});

</script>

<template>
  <div class="space-y-8 md:p-6 max-w-full mx-auto">
    <Dialog 
      v-model:visible="deleteDialogVisible" 
      :style="{ width: '350px', backgroundColor: dialogBackgroundColor }"
      :modal="true"
      :closable="false"
      :draggable="false"
      class="custom-dialog"
    >
      <template #header>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Confirm Deletion</h3>
      </template>

      <p class="text-gray-600 dark:text-gray-400 mt-4 text-xs md:text-base">
        Are you sure you want to delete receipt <span class="font-semibold">{{ receiptToDelete }}</span>?
        This action cannot be undone.
      </p>

      <div class="flex justify-end gap-4 mt-6">
        <button
          class="text-xs md:text-base bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-md shadow hover:shadow-lg transition-all"
          @click="closeDeleteDialog"
        >
          Cancel
        </button>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:shadow-lg hover:bg-red-600 transition-all text-xs md:text-base"
          @click="deleteReceipt(receiptToDelete)"
        >
          Delete
        </button>
      </div>
    </Dialog>

    <Drawer v-model:visible="addDrawerVisible" position="right" :style="{ backgroundColor: drawerBackgroundColor, width: '400px' }">
      <h3 class="text-xl font-semibold text-gray-600 dark:text-gray-400">Add New Receipt</h3>
      <form @submit.prevent="addReceipt" class="space-y-4 mt-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Customer Name</label>
          <input 
            id="name" 
            v-model="receipt.customer" 
            type="text" 
            class="w-full p-2 border border-gray-300 rounded-md" 
            placeholder="Enter customer name" required
            :class="[
              isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            ]"
          />
        </div>

        <div>
          <label for="name" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Customer Number</label>
          <input 
            id="name" 
            v-model="receipt.customerNumber" 
            type="text" 
            class="w-full p-2 border border-gray-300 rounded-md" 
            placeholder="Enter customer number" required
            :class="[
              isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            ]"
          />
        </div>

        <div>
          <label for="name" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Customer email</label>
          <input 
            id="name" 
            v-model="receipt.customerEmail" 
            type="text" 
            class="w-full p-2 border border-gray-300 rounded-md" 
            placeholder="Enter customer email" required
            :class="[
              isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            ]"
          />
        </div>

        <div>
          <label for="name" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Amount</label>
          <input 
            id="name" 
            v-model="receipt.amount" 
            type="number" 
            class="w-full p-2 border border-gray-300 rounded-md" 
            placeholder="Enter serial number" required
            :class="[
              isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            ]"
          />
        </div>

        <div>
          <label for="name" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Serial Number</label>
          <input 
            id="name" 
            v-model="receipt.serialNumber" 
            type="text" 
            class="w-full p-2 border border-gray-300 rounded-md" 
            placeholder="Enter serial number" required
            :class="[
              isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            ]"
          />
        </div>

        <div>
          <label for="name" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Mode of payment</label>
          <Select 
            v-model="receipt.paidVia"          
            :options="modeOfPayment"                
            optionLabel="name"                  
            placeholder="Select a Grade"
            :style="{
              width: '100%',
              height: '2.6rem',
              padding: '0.2rem', 
              border: isDarkMode ? '1px solid #4A4A4A' : '1px solid #D1D5DB', 
              borderRadius: '0.375rem', 
              backgroundColor: isDarkMode ? '#201F2A' : '#CDCFD9', 
              color: isDarkMode ? '#D1D5DB' : '#1F2937'
            }"
          />
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button type="button" @click="addDrawerVisible = false" class="text-gray-500 hover:text-gray-600 -mt-2">Cancel</button>
          <button
            type="submit"
            :disabled="isAddingReceipt"
            class="p-2 rounded-md shadow-md mb-4 flex items-center justify-center gap-2 transition-all duration-300"
            style="background-color: #4c5270; color: white; border-color: #4c5270;"
          >
            <i v-if="isAddingReceipt" class="pi pi-spin pi-spinner"></i>
            {{ isAddingReceipt ? 'Adding...' : 'Add Receipt' }}
          </button>
        </div>
      </form>
    </Drawer>

    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg">
      <h2 class="text-sm md:text-2xl font-semibold">Receipts</h2>
      <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400">View and manage all receipts</p>
    </div>

    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg h-[550px] md:h-[680px]">
      <div class="flex justify-between items-center pb-4">
        <h3 class="text-sm md:text-2xl text-dark-text dark:text-light-text">Receipts</h3>
        <div class="flex justify-between items-center mb-4">
        </div>
        <div class="flex gap-x-2">
          <button 
            @click="openCreateReceiptDrawer"
            style="background-color: #4c5270; color: white; border-color: #4c5270;"
            class="text-xs md:text-base p-2 rounded-md shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 transition-all duration-300">
            <i class="text-xs md:text-base pi pi-plus"></i> Generate Receipt 
          </button>
        </div>
      </div>
  
      <div class="flex flex-col h-[400px] md:h-[510px]">
        <div class="overflow-x-auto">
          <div v-if="store.receipts.length === 0" class="flex flex-col items-center justify-center space-y-4 mt-24 md:mt-32">
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
              @click="openCreateReceiptDrawer"
              style="background-color: #4c5270; color: white; border-color: #4c5270;"
              class="text-xs md:text-base p-2 rounded-md shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-300">
              <i class="text-xs md:text-base pi pi-plus"></i> Add 
            </button>
          </div>

          <table v-else class="min-w-full border border-gray-300 dark:border-gray-600 text-xs md:text-sm">
            <thead class="bg-light-bg dark:bg-darker-bg">
              <tr>
                <th class="text-left py-2 px-2 text-dark-text dark:text-light-text whitespace-nowrap">S/N</th>
                <th 
                  class="text-left py-2 px-4 text-dark-text dark:text-light-text cursor-pointer whitespace-nowrap"
                  @click="toggleCategoryDropdown"
                >
                  CATEGORY
                  <!-- Category Dropdown Toggle -->
                  <span v-if="showCategoryDropdown">▼</span>
                  <span v-else>▲</span>
                </th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap sticky left-0 z-10 bg-light-bg dark:bg-darker-bg">REC ID</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">PRODUCT</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">DESCRIPTION</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">PRICE</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">CUSTOMER</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">COLOR</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">SIZE</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">SWAP IN</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">SERIAL NO</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">PAID VIA</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">DATE</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap"></th>
              </tr>
              <div v-if="showCategoryDropdown" class="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg rounded-md mt-2 w-[200px] z-20">
                <div 
                  v-for="category in categories" 
                  :key="category.name" 
                  @click="selectCategory(category)"
                  class="cursor-pointer px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  {{ category.name }}
                </div>
                <div @click="selectCategory(null)" class="cursor-pointer px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                  Show All
                </div>
              </div>
            </thead>
            <tbody>
              <tr 
                v-for="(receipt, index) in filteredReceipts" 
                :key="index" 
                class="hover:bg-light-bg hover:dark:bg-dark-bg">
                <td class="py-2 px-2 text-dark-text dark:text-light-text whitespace-nowrap">{{ calculateIndex(index) }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.category.name }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap sticky left-0 z-10 bg-lighter-bg dark:bg-darker-bg">INV-{{ receipt.id }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.name }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.description }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">${{ receipt.amount }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.customer }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.color }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.size }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.swap.name }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.serialNumber }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.paidVia.name }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ receipt.date }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">
                  <button 
                    @click="duplicateReceipt(receipt)" 
                    class="text-blue-500 hover:text-blue-600"
                  >
                    Duplicate
                  </button>
                  <button @click="openDeleteDialog(receipt)" class="ml-2 text-red-500 hover:text-red-600">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-between items-center mt-4">
        <button 
          @click="currentPage > 1 && (currentPage--)" :disabled="currentPage === 1"
          class="bg-gray-200 dark:bg-gray-600 text-dark-text dark:text-light-text text-sm px-4 py-2 rounded shadow"
        >
          Previous
        </button>
        <span class="text-gray-600 dark:text-gray-300 text-xs md:text-sm">
          Page {{ currentPage }} of {{ Math.ceil(store.receipts.length / itemsPerPage) }}
        </span>
        <button 
          @click="currentPage * itemsPerPage < store.receipts.length && (currentPage++)"
          :disabled="currentPage * itemsPerPage >= store.receipts.length"
          class="bg-gray-200 dark:bg-gray-600 text-dark-text dark:text-light-text text-sm px-4 py-2 rounded shadow"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>