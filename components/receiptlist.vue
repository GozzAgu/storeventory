<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useReceiptStore } from '@/stores/receipt';
import { useInvStore } from '@/stores/inventory';
import { ref, computed, onMounted } from 'vue';
import { collection, query, where, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";

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
const showModal = ref(false);
const showAdditionalFields = ref(false);

const openCreateReceiptDrawer = () => {
  addDrawerVisible.value = true;
};

const dialogBackgroundColor = computed(() =>
  isDarkMode.value ? '#201F2A' : '#FFFFFF'
);

const nextFields = () => {
  showAdditionalFields.value = true;
};
const modeOfPayment = [
  { name: 'Cash' },
  { name: 'Bank Transfer' },
  { name: 'POS' },
  { name: 'Crypto' },
];

const swaps = ref([
  { name: 'Yes'},
  { name: 'No'},
]);

const grades = ref([
  { name: 'New'},
  { name: 'Used'},
]);

const product = ref({
  name: '',
  description: '',
  category: {} as Category,
  price: '',
  color: '',
  size: '',
  grade: '',
  swapIn: '',
  serialNumber: '',
  supplier: '',
  dateIn: '',
  dateOut: '',
  isSold: false,
  inventoryOf: authStore.currentUser?.id,
});

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
  store.removeReceiptItem(receipt.id);
  closeDeleteDialog();
};

const openDeleteDialog = (receipt: any) => {
  itemToDelete.value = receipt;
  deleteDialogVisible.value = true;
};

const openReceiptDialog = (receipt: any) => {
  itemToDelete.value = receipt;
  showModal.value = true;
};

const closeDeleteDialog = () => {
  deleteDialogVisible.value = false;
  receiptToDelete.value = null;
};

const addReceipt = async () => {
  if (!authStore.currentUser?.id) {
    console.error("User is not authenticated.");
    alert("Please log in to add receipts.");
    return;
  }

  isAddingReceipt.value = true;
  try {
    let inventoryDetails: any = {};
    let inventoryDocId: string | null = null;

    if (receipt.value.serialNumber) {
      const receiptsRef = collection(nuxtApp.$firestore, "receipts");
      const receiptQuery = query(receiptsRef, where("serialNumber", "==", receipt.value.serialNumber));
      const receiptSnapshot = await getDocs(receiptQuery);

      if (!receiptSnapshot.empty) {
        console.warn("A receipt with this serial number already exists:", receipt.value.serialNumber);
        alert("A receipt with this serial number already exists! Please use a different serial number.");
        isAddingReceipt.value = false;
        return;
      }

      const inventoryRef = collection(nuxtApp.$firestore, "inventory");
      const inventoryQuery = query(inventoryRef, where("serialNumber", "==", receipt.value.serialNumber));
      const inventorySnapshot = await getDocs(inventoryQuery);

      if (!inventorySnapshot.empty) {
        const docSnap = inventorySnapshot.docs[0];
        inventoryDetails = docSnap.data();
        inventoryDocId = docSnap.id;
      } else {
        console.warn("No inventory found for serial number:", receipt.value.serialNumber);
        alert("No inventory found for the entered serial number.");
        isAddingReceipt.value = false;
        return;
      }
    }

    const receiptOwner = authStore.currentUser?.adminId ?? authStore.currentUser.id;

    const newReceipt = {
      name: inventoryDetails.name || receipt.value.name,
      description: inventoryDetails.description || receipt.value.description,
      amount: receipt.value.amount,
      customer: receipt.value.customer,
      customerEmail: receipt.value.customerEmail,
      customerNumber: receipt.value.customerNumber,
      category: inventoryDetails.category || receipt.value.category,
      color: inventoryDetails.color || receipt.value.color,
      size: inventoryDetails.size || receipt.value.size,
      date: new Date().toISOString().split("T")[0],
      swap: receipt.value.swap,
      paidVia: receipt.value.paidVia,
      serialNumber: inventoryDetails.serialNumber || receipt.value.serialNumber,
      issuedBy: authStore.currentUser.email,
      receiptOf: receiptOwner,
      receiptNumber: "",
    };

    if(receipt.value.swap?.name === 'Yes') {
      const newProduct = {
        name: product.value.name,
        description: product.value.description,
        category: product.value.category,
        price: product.value.price,
        color: product.value.color,
        size: product.value.size,
        grade: product.value.grade,
        swapIn: product.value.swapIn,
        serialNumber: product.value.serialNumber,
        supplier: product.value.supplier,
        dateIn: new Date().toISOString().split("T")[0],
        dateOut: "--",
        isSold: false,
        inventoryOf: authStore.currentUser?.id,
      }
      invStore.addInventoryItem(newProduct as any);
    }
    const receiptsCollection = collection(nuxtApp.$firestore, "receipts");
    const docRef = await addDoc(receiptsCollection, newReceipt);

    await updateDoc(doc(docRef.firestore, "receipts", docRef.id), {
      receiptNumber: docRef.id,
    });

    if (inventoryDocId) {
      const inventoryItemRef = doc(nuxtApp.$firestore, "inventory", inventoryDocId);
      await updateDoc(inventoryItemRef, { isSold: true, dateOut: new Date().toISOString().split("T")[0] });
    }

    await store.fetchReceipts();
    await invStore.fetchInventory();

    receipt.value = {
      name: "",
      description: "",
      amount: 0,
      category: "",
      customer: "",
      customerEmail: "",
      customerNumber: "",
      color: "",
      size: "",
      date: "",
      swap: false,
      paidVia: "",
      serialNumber: "",
      receiptNumber: "",
      issuedBy: authStore.currentUser?.id,
      receiptOf: "",
    };

    addDrawerVisible.value = false;
  } catch (error) {
    console.error("Error adding receipt:", error);
    alert("Failed to add receipt. Please try again.");
  } finally {
    isAddingReceipt.value = false;
  }
};

const duplicateReceipt = (receiptToDuplicate: any) => {
  receipt.value = {
    ...receiptToDuplicate,
    receiptNumber: "",
    issuedBy: authStore.currentUser?.email,
    date: new Date().toISOString().split("T")[0],
  };
  addDrawerVisible.value = true;
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

const isReceiptComplete = computed(() => {
  return (
    receipt.value.amount &&
    receipt.value.customer &&
    receipt.value.customerEmail &&
    receipt.value.customerNumber &&
    receipt.value.serialNumber &&
    receipt.value.paidVia
  );
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
      v-model:visible="showModal" 
      :style="{ width: '400px', backgroundColor: dialogBackgroundColor }"
      :modal="true"
      :closable="false"
      :draggable="false"
      class="custom-dialog"
    >
      <template #header>
        <h3 class="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-100">SwiftSort Receipt</h3>
      </template>

      <div class="receipt bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-gray-800 dark:text-gray-100">
        <div class="text-center border-b border-gray-300 pb-2">
          <h2 class="text-lg font-semibold">Receipt</h2>
          <p class="text-sm text-gray-500">Issued by: {{  }}</p>
          <p class="text-sm text-gray-500">On</p>
          <p class="text-sm text-gray-500">Date: {{  }}</p>
        </div>
        <!-- <div class="mt-4 space-y-2">
          <span>{{ itemToDelete.name }}</span>
          <span>{{ itemToDelete.customer }}</span>
          <span>{{ itemToDelete.customerEmail }}</span>
          <span>{{ itemToDelete.customerNumber }}</span>
          <span>{{ itemToDelete.amount }}</span>
          <span>{{ itemToDelete.color }}</span>
          <span>{{ itemToDelete.size }}</span>
          <span>{{ itemToDelete.swap.name }}</span>
          <span>{{ itemToDelete.serialNumber }}</span>
          <span>{{ itemToDelete.paidVia.name }}</span>
          <span>{{ itemToDelete.date }}</span>
        </div> -->
      </div>

      
      <div class="flex justify-end gap-4 mt-6">
        <button
          class="text-xs md:text-base bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-md shadow hover:shadow-lg transition-all"
          @click=""
        >
          Download
        </button>
      </div>
    </Dialog>

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
          @click="deleteReceipt(itemToDelete)"
        >
          Delete
        </button>
      </div>
    </Dialog>

    <Drawer v-model:visible="addDrawerVisible" position="right" :style="{ backgroundColor: drawerBackgroundColor, width: '400px' }">
      <h3 class="font-semibold text-gray-600 dark:text-gray-400">Add New Receipt</h3>
      <form @submit.prevent="addReceipt" class="mt-4">
        <div class="space-y-4" v-if="showAdditionalFields">
          <div>
            <label for="name" class="block text-xs text-gray-600 dark:text-gray-400">Product name</label>
            <input 
            id="name" 
            v-model="product.name" 
            type="text" 
            class="w-full p-[0.3em] border border-gray-300 rounded-md" 
            placeholder="Enter product" required
            :class="[
              isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            ]"
            />
          </div>

          <div>
            <label for="email" class="block text-xs text-gray-600 dark:text-gray-400">Description</label>
            <input 
            id="name" 
            v-model="product.description" 
            type="text" 
            class="w-full p-[0.3em] border border-gray-300 rounded-md" 
            placeholder="Enter description" required
            :class="[
              isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            ]"
            />
          </div>
          <div>
            <label for="name" class="block text-xs text-gray-600 dark:text-gray-400">Category</label>
            <Select 
              v-model="product.category"          
              :options="categories"                
              optionLabel="name"                  
              placeholder="Select a Category"
              :style="{
                width: '100%',
                height: '2.3rem',
                padding: '0.05rem', 
                border: isDarkMode ? '1px solid #4A4A4A' : '1px solid #D1D5DB', 
                borderRadius: '0.375rem', 
                backgroundColor: isDarkMode ? '#201F2A' : '#CDCFD9', 
                color: isDarkMode ? '#D1D5DB' : '#1F2937'
              }"
            />
          </div>

          <div>
            <label for="email" class="block text-xs text-gray-600 dark:text-gray-400">Price</label>
            <input 
            id="name" 
            v-model="product.price" 
            type="number" 
            class="w-full p-[0.3em] border border-gray-300 rounded-md" 
            placeholder="Enter price" required
            :class="[
              isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            ]"
            />
          </div>
          <div>
            <label for="name" class="block text-xs text-gray-600 dark:text-gray-400">Color</label>
            <input 
            id="name" 
            v-model="product.color" 
            type="text" 
            class="w-full p-[0.3em] border border-gray-300 rounded-md" 
            placeholder="Enter color" required
            :class="[
              isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            ]"
            />
          </div>

          <div>
            <label for="email" class="block text-xs text-gray-600 dark:text-gray-400">Size</label>
            <input 
            id="name" 
            v-model="product.size" 
            type="text" 
            class="w-full p-[0.3em] border border-gray-300 rounded-md" 
            placeholder="Enter size" required
            :class="[
              isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            ]"
            />
          </div>
          <div>
            <label for="name" class="block text-xs text-gray-600 dark:text-gray-400">Grade</label>
            <Select 
              v-model="product.grade"          
              :options="grades"                
              optionLabel="name"                  
              placeholder="Select a Grade"
              :style="{
                width: '100%',
                height: '2.3rem',
                padding: '0.05rem', 
                border: isDarkMode ? '1px solid #4A4A4A' : '1px solid #D1D5DB', 
                borderRadius: '0.375rem', 
                backgroundColor: isDarkMode ? '#201F2A' : '#CDCFD9', 
                color: isDarkMode ? '#D1D5DB' : '#1F2937'
              }"
            />
          </div>

          <div>
            <label for="email" class="block text-xs text-gray-600 dark:text-gray-400">Swap ?</label>
            <Select 
              v-model="product.swapIn"          
              :options="swaps"                
              optionLabel="name"                  
              placeholder="Swap?"
              :style="{
                width: '100%',
                height: '2.3rem',
                padding: '0.05rem', 
                border: isDarkMode ? '1px solid #4A4A4A' : '1px solid #D1D5DB', 
                borderRadius: '0.375rem', 
                backgroundColor: isDarkMode ? '#201F2A' : '#CDCFD9', 
                color: isDarkMode ? '#D1D5DB' : '#1F2937'
              }"
            />
          </div>
          <div>
            <label for="name" class="block text-xs text-gray-600 dark:text-gray-400">Serial No</label>
            <input 
            id="name" 
            v-model="product.serialNumber" 
            type="text" 
            class="w-full p-[0.3em] border border-gray-300 rounded-md" 
            placeholder="Enter Serial No" required
            :class="[
              isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            ]"
            />
          </div>

          <div>
            <label for="email" class="block text-xs text-gray-600 dark:text-gray-400">Supplier</label>
            <input 
            id="name" 
            v-model="product.supplier" 
            type="text" 
            class="w-full p-[0.3em] border border-gray-300 rounded-md" 
            placeholder="Enter supplier" required
            :class="[
              isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            ]"
            />
          </div>
        </div>

        <div v-else class="space-y-4">
          <div>
            <label for="name" class="block text-xs text-gray-600 dark:text-gray-400">Customer Name</label>
            <input 
              id="name" 
              v-model="receipt.customer" 
              type="text" 
              class="w-full p-[0.3em] border border-gray-300 rounded-md" 
              placeholder="Enter customer name" required
              :class="[
                isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
              ]"
            />
          </div>
  
          <div>
            <label for="name" class="block text-xs text-gray-600 dark:text-gray-400">Customer Number</label>
            <input 
              id="name" 
              v-model="receipt.customerNumber" 
              type="text" 
              class="w-full p-[0.3em] border border-gray-300 rounded-md" 
              placeholder="Enter customer number" required
              :class="[
                isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
              ]"
            />
          </div>
  
          <div>
            <label for="name" class="block text-xs text-gray-600 dark:text-gray-400">Customer email</label>
            <input 
              id="name" 
              v-model="receipt.customerEmail" 
              type="text" 
              class="w-full p-[0.3em] border border-gray-300 rounded-md" 
              placeholder="Enter customer email" required
              :class="[
                isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
              ]"
            />
          </div>
  
          <div>
            <label for="name" class="block text-xs text-gray-600 dark:text-gray-400">Amount</label>
            <input 
              id="name" 
              v-model="receipt.amount" 
              type="number" 
              class="w-full p-[0.3em] border border-gray-300 rounded-md" 
              placeholder="Enter serial number" required
              :class="[
                isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
              ]"
            />
          </div>
  
          <div>
            <label for="name" class="block text-xs text-gray-600 dark:text-gray-400">Serial Number</label>
            <input 
              id="name" 
              v-model="receipt.serialNumber" 
              type="text" 
              class="w-full p-[0.3em] border border-gray-300 rounded-md" 
              placeholder="Enter serial number" required
              :class="[
                isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
              ]"
            />
          </div>
  
          <div>
            <label for="name" class="block text-xs text-gray-600 dark:text-gray-400">Mode of payment</label>
            <Select 
              v-model="receipt.paidVia"          
              :options="modeOfPayment"                
              optionLabel="name"                  
              placeholder="Select a Grade"
              :style="{
                width: '100%',
                height: '2.3rem',
                padding: '0.05rem', 
                border: isDarkMode ? '1px solid #4A4A4A' : '1px solid #D1D5DB', 
                borderRadius: '0.375rem', 
                backgroundColor: isDarkMode ? '#201F2A' : '#CDCFD9', 
                color: isDarkMode ? '#D1D5DB' : '#1F2937'
              }"
            />
          </div>
  
          <div>
            <label for="name" class="block text-xs font-medium text-gray-600 dark:text-gray-400">Swap ?</label>
            <Select 
              v-model="receipt.swap"          
              :options="swaps"                
              optionLabel="name"                  
              placeholder="Is this a swap?"
              :style="{
                width: '100%',
                height: '2.3rem',
                padding: '0.05rem', 
                border: isDarkMode ? '1px solid #4A4A4A' : '1px solid #D1D5DB', 
                borderRadius: '0.375rem', 
                backgroundColor: isDarkMode ? '#201F2A' : '#CDCFD9', 
                color: isDarkMode ? '#D1D5DB' : '#1F2937'
              }"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-4 mt-4 fixed bottom-2 right-4">
          <button type="button" @click="addDrawerVisible = false" class="text-gray-500 hover:text-gray-600 -mt-2 text-xs md:text-sm py-1 px-2">Cancel</button>
          <button v-if="receipt.swap?.name === 'Yes' && !showAdditionalFields && isReceiptComplete" 
            type="button" 
            @click="nextFields" 
            class="py-1 px-2 rounded-md mb-4 flex items-center justify-center gap-2 transition-all duration-300 text-xs md:text-sm"
            style="background-color: #4c5270; color: white; border-color: #4c5270;"
          >
            Next
            <i class="text-xs md:text-sm pi pi-angle-right"></i>
          </button>
          <button
            v-if="receipt.swap?.name === 'No' || (receipt.swap?.name === 'Yes' && showAdditionalFields)"
            type="submit"
            :disabled="isAddingReceipt || receipt.swap?.name === 'Yes' && !product"
            class="py-1 px-2 rounded-md shadow-md mb-4 flex items-center justify-center gap-2 transition-all duration-300 text-xs md:text-sm"
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
        <h3 class="text-sm md:text-2xl text-dark-text dark:text-light-text">Items ({{ store.receipts.length }})</h3>
        <div class="flex justify-between items-center mb-4">
        </div>
        <div class="flex gap-x-2">
          <button 
            @click="openCreateReceiptDrawer"
            style="background-color: #4c5270; color: white; border-color: #4c5270;"
            class="text-xs md:text-sm p-2 rounded-md shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 transition-all duration-300">
            <i class="text-xs md:text-sm pi pi-plus"></i> Generate Receipt 
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
              No receopt data available. Add new items to get started.
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
                  <span v-if="showCategoryDropdown">▼</span>
                  <span v-else>▲</span>
                </th>
                <!-- <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap sticky left-0 bg-light-bg dark:bg-darker-bg">REC ID</th> -->
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap sticky left-0 bg-light-bg dark:bg-darker-bg">PRODUCT</th>
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
                <!-- <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap sticky left-0 bg-lighter-bg dark:bg-darker-bg">INV-{{ receipt.id }}</td> -->
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap sticky left-0 bg-lighter-bg dark:bg-darker-bg">{{ receipt.name }}</td>
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
                  <button @click="openReceiptDialog(receipt)" class="text-indigo-900 hover:text-indigo-700">
                    <i class="text-xs md:text-base pi pi-receipt"></i>
                  </button>

                  <button @click="duplicateReceipt(receipt)" class="ml-2 text-indigo-900 hover:text-indigo-700">
                    <i class="text-xs md:text-base pi pi-copy"></i>
                  </button>
            
                  <button @click="openDeleteDialog(receipt)" class="ml-2 text-red-500 hover:text-red-600">
                    <i class="text-xs md:text-base pi pi-trash"></i>
                  </button>
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