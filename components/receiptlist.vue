<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useReceiptStore } from '@/stores/receipt';
import { ref, computed, onMounted } from 'vue';

const authStore = useAuthStore();
const store = useReceiptStore();
const addDrawerVisible = ref(false);
const isDarkMode = useState('isDarkMode');
const currentPage = ref(1);
const itemsPerPage = ref(30);
const isAddingReceipt = ref(false);
const deleteDialogVisible = ref(false);
const receiptToDelete = ref(null);

const openCreateReceiptDrawer = () => {
  addDrawerVisible.value = true;
};

const dialogBackgroundColor = computed(() =>
  isDarkMode.value ? '#201F2A' : '#FFFFFF'
);

const receipt = ref({
  name: '',
  description: '',
  amount: '',
  customer: '',
  date: '',
  swap: false,
  paidVia: '',
  serialNumber: '',
  receiptNumber: '',
  issuedBy: authStore.currentUser?.id,
  receiptOf: '',
});

const deleteReceipt = (receipt: any) => {
  // store.removeReceiptItem(receipt.id);
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
    const newReceipt = {
      name: receipt.value.name,
      description: receipt.value.description,
      amount: parseFloat(receipt.value.amount),
      customer: receipt.value.customer,
      date: receipt.value.date,
      swap: receipt.value.swap,
      paidVia: receipt.value.paidVia,
      receiptNumber: receipt.value.receiptNumber,
      issuedBy: authStore.currentUser.id,
    };

    await store.addReceipt(newReceipt as any);

    receipt.value = {
      name: '',
      description: '',
      amount: '',
      customer: '',
      date: '',
      swap: false,
      paidVia: '',
      serialNumber: '',
      receiptNumber: '',
      issuedBy: authStore.currentUser?.id,
      receiptOf: '',
    };
    // await store.fetchReceipts();
    addDrawerVisible.value = false;
  } catch (error) {
    console.error('Error adding receipt:', error);
  } finally {
    isAddingReceipt.value = false;
  }
};

const drawerBackgroundColor = computed(() => {
  return isDarkMode.value ? '#201F2A' : '#E3E4EB';
});

onMounted(async () => {
  if (authStore.currentUser) {
    // await store.fetchReceipts();
    if (!store.receipts) {
      store.receipts = []; // Ensure it's an array
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
          <label for="name" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Receipt Name</label>
          <input 
            id="name" 
            v-model="receipt.name" 
            type="text" 
            class="w-full p-2 border border-gray-300 rounded-md" 
            placeholder="Enter receipt name" required
            :class="[
              isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            ]"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
          <input 
            id="description" 
            v-model="receipt.description" 
            type="text" 
            class="w-full p-2 border border-gray-300 rounded-md" 
            placeholder="Enter description" required
            :class="[
              isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            ]"
          />
        </div>

        <div>
          <label for="customer" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Customer</label>
          <input 
            id="customer" 
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
          <label for="amount" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Amount</label>
          <input 
            id="amount" 
            v-model="receipt.amount" 
            type="number" 
            class="w-full p-2 border border-gray-300 rounded-md" 
            placeholder="Enter amount" required
            :class="[
              isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            ]"
          />
        </div>

        <div>
          <label for="receiptNumber" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Receipt Number</label>
          <input 
            id="receiptNumber" 
            v-model="receipt.receiptNumber" 
            type="text" 
            class="w-full p-2 border border-gray-300 rounded-md" 
            placeholder="Enter receipt number" required
            :class="[
              isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            ]"
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

          <div v-else></div>
        </div>
      </div>
    </div>
  </div>
</template>