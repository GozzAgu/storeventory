<script setup lang="ts">
import { useInvStore } from '@/stores/inventory';

const authStore = useAuthStore();
const store = useInvStore();
const addDrawerVisible = ref(false);
const isDarkMode = useState('isDarkMode');
const currentPage = ref(1);
const itemsPerPage = ref(30);
const isAddingInventory = ref(false);
const showCategoryDropdown = ref(false);
const showSwapDropdown = ref(false);
const showGradeDropdown = ref(false);
const showAvailabilityDropdown = ref(false);
const deleteDialogVisible = ref(false);
const itemToDelete = ref(null);
const loading = ref(true);
const isDrawerPinned = ref(false);

const dialogBackgroundColor = computed(() =>
  isDarkMode.value ? '#201F2A' : '#FFFFFF'
);

type Category = { name: string };
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

const toggleCategoryDropdown = () => {
  showCategoryDropdown.value = !showCategoryDropdown.value;
};

const toggleSwapDropdown = () => {
  showSwapDropdown.value = !showSwapDropdown.value;
};

const toggleGradeDropdown = () => {
  showGradeDropdown.value = !showGradeDropdown.value;
};

const toggleAvailabilityDropdown = () => {
  showAvailabilityDropdown.value = !showAvailabilityDropdown.value;
};

const filteredInventory = computed(() => {
  if (!selectedCategory.value) {
    return paginatedInventory.value;
  }
  return paginatedInventory.value.filter(item => item.category.name === selectedCategory.value?.name);
});

const paginatedInventory = computed(() => {
  const sortedInventory = [...store.inventory].sort((a, b) => {
    return new Date(b.dateIn).getTime() - new Date(a.dateIn).getTime();
  });

  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedInventory.slice(start, end);
});

const formatDateTime = (isoString: string) => {
  const dateTime = new Date(isoString);
  const date = dateTime.toLocaleDateString();
  const time = dateTime.toLocaleTimeString();
  return { date, time };
};

const selectedCategory = ref<Category | null>(null);

const selectCategory = (category: Category | null) => {
  selectedCategory.value = category;
  showCategoryDropdown.value = false;
};

const categories = ref([
  { name: 'Phones' },
  { name: 'Laptops' },
  { name: 'Home Appliances' },
  { name: 'Clothing' },
  { name: 'Others' },
]);

const swaps = ref([
  { name: 'Yes' },
  { name: 'No' },
]);

const grades = ref([
  { name: 'New' },
  { name: 'Used' },
]);

const resetProduct = () => {
  product.value = {
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
    inventoryOf: authStore.currentUser?.id || '',
  };
};

const duplicateInventory = (inventory: any) => {
  product.value = {
    ...inventory,
    issuedBy: authStore.currentUser?.email,
    date: new Date().toISOString().split("T")[0],
  };

  addDrawerVisible.value = true;
};

const closeDrawer = () => {
  addDrawerVisible.value = false;
};

watch(addDrawerVisible, (newValue) => {
  if (!newValue) {
    resetProduct();
  }
});

const deleteInventory = (inventory: any) => {
  store.removeInventoryItem(inventory.id);
  closeDeleteDialog();
};

const openDeleteDialog = (inventory: any) => {
  itemToDelete.value = inventory;
  deleteDialogVisible.value = true;
};

const closeDeleteDialog = () => {
  deleteDialogVisible.value = false;
  itemToDelete.value = null;
};

const addInventory = async () => {
  if (!authStore.currentUser?.id) {
    console.error('User is not authenticated.');
    alert('Please log in to add inventory items.');
    return;
  }

  const serialExists = store.inventory.some(item => item.serialNumber === product.value.serialNumber);

  if (serialExists) {
    alert('An inventory item with this serial number already exists.');
    return;
  }

  isAddingInventory.value = true;
  try {
    const newProduct = {
      ...product.value,
      price: parseFloat(product.value.price),
      dateIn: new Date().toISOString(),
      dateOut: '--',
      inventoryOf: authStore.currentUser.id,
    };

    await store.addInventoryItem(newProduct as any);

    resetProduct();
    await store.fetchInventory();

    // Only close the drawer if it's not pinned
    if (!isDrawerPinned.value) {
      addDrawerVisible.value = false;
    }
  } catch (error) {
    console.error('Error adding inventory:', error);
  } finally {
    isAddingInventory.value = false;
  }
};

const drawerBackgroundColor = computed(() => {
  return isDarkMode.value ? '#201F2A' : '#E3E4EB';
});

const calculateIndex = (index: any) => {
  return (currentPage.value - 1) * itemsPerPage.value + index + 1;
};

const openCreateInventoryDrawer = () => {
  addDrawerVisible.value = true;
};

const totalInventory = computed(() => store.totalInventory);

const exportCSV = () => {
  const csvContent = [
    ['CATEGORY', 'PRODUCT', 'DESCRIPTION', 'PRICE', 'COLOR', 'SIZE', 'GRADE', 'AVAILABILITY', 'SWAP IN', 'SERIAL NO', 'SUPPLIER', 'DATE IN', 'TIME IN', 'DATE OUT'],
    ...store.inventory.map(inv => [
      inv.category.name,
      inv.name,
      inv.description,
      inv.price,
      inv.color,
      inv.size,
      inv.grade.name,
      inv.isSold ? 'Sold' : 'Available',
      inv.swapIn.name,
      inv.serialNumber,
      inv.supplier,
      formatDateTime(inv.dateIn).date,
      formatDateTime(inv.dateIn).time,
      inv.dateOut,
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

const pinDrawer = () => {
  isDrawerPinned.value = !isDrawerPinned.value;
};

onMounted(async () => {
  if (authStore.currentUser) {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    await store.fetchInventory();
    loading.value = false;
  } else {
    console.error('No current user found');
  }
});
</script>

<template>
  <div class="space-y-8 max-w-full mx-auto">
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
        Are you sure you want to delete <span class="font-semibold">{{ itemToDelete?.name }}</span>?
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
          @click="deleteInventory(itemToDelete)"
        >
          Delete
        </button>
      </div>
    </Dialog>
    <Drawer v-model:visible="addDrawerVisible" position="right" :style="{ backgroundColor: drawerBackgroundColor, width: '400px' }">
      <div class="flex justify-between">
        <h3 class="text-xl font-semibold text-gray-600 dark:text-gray-400">
          Add New Inventory
          <br />
          <span v-if="isDrawerPinned" class="text-[0.7rem] font-thin text-green-500">Drawer is pinned</span>
          <span v-else class="text-[0.7rem] font-thin text-orange-500">You can pin the drawer by clicking on the window icon</span>
        </h3>
        <i 
          @click="pinDrawer" 
          class="pi pi-thumbtack text-cyan-600 text-sm md:text-xl cursor-pointer"
          :class="{ 'text-orange-500': isDrawerPinned }"
        ></i>
      </div>
      <form @submit.prevent="addInventory" class="space-y-4 mt-4">
        <div class="space-y-4">
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

        <div class="flex justify-end space-x-4 mt-4 fixed bottom-2 right-4">
          <button type="button" @click="closeDrawer" class="text-gray-500 hover:text-gray-600 -mt-2 py-1 px-2">Cancel</button>
          <button
            type="submit"
            :disabled="isAddingInventory"
            class="py-1 px-2 rounded-md shadow-md mb-4 flex items-center justify-center gap-2 transition-all duration-300"
            style="background-color: #4c5270; color: white; border-color: #4c5270;"
          >
            <i v-if="isAddingInventory" class="pi pi-spin pi-spinner pi-save"></i>
            <i v-else class="pi pi-save"></i>
            {{ isAddingInventory ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </Drawer>

    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-md">
      <h2 class="text-sm md:text-2xl font-semibold">Inventory</h2>
      <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400">View and manage all products in inventory</p>
    </div>

    <div class="bg-lighter-bg dark:bg-darker-bg px-3 py-6 md:p-6 rounded-md h-[470px] md:h-[680px]">
      <div class="flex justify-between items-center pb-4">
        <h3 class="text-sm md:text-2xl text-dark-text dark:text-light-text">Items ({{ store.inventory.length }})</h3>
        <div class="flex justify-between items-center mb-4">
        </div>
        <div class="flex gap-x-2">
          <!-- <button 
            @click="importCSV"
            style="background-color: #4c5270; color: white; border-color: #4c5270;"
            class="text-xs md:text-sm p-2 rounded-md hover:scale-105 flex items-center justify-center gap-2 transition-all duration-300">
            <i class="text-xs md:text-sm pi pi-file-import"></i> Import
          </button> -->
          <button 
            @click="exportCSV"
            style="background-color: #4c5270; color: white; border-color: #4c5270;"
            class="text-xs md:text-sm p-2 rounded-md hover:scale-105 flex items-center justify-center gap-2 transition-all duration-300">
            <i class="text-xs md:text-sm pi pi-file-export"></i> Export
          </button>
          <button 
            @click="openCreateInventoryDrawer"
            style="background-color: #4c5270; color: white; border-color: #4c5270;"
            class="text-xs md:text-sm p-2 rounded-md hover:scale-105 flex items-center justify-center gap-2 transition-all duration-300">
            <i class="text-xs md:text-sm pi pi-file-plus"></i> Add 
          </button>
        </div>
      </div>

      <div class="">
        <h3 class="text-sm md:text-base text-dark-text dark:text-light-text">
          Total Inventory Value: 
          <span class="text-green-500 font-black">
            ${{ totalInventory }}
          </span>
        </h3>
      </div>

      <div class="flex flex-col h-[320px] md:h-[510px]">
        <div class="overflow-x-auto table-container">
          <div v-if="loading" class="flex items-center justify-center h-[320px] md:h-[510px]">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-700"></div>
          </div>
          <div v-else-if="store.inventory.length === 0" class="flex flex-col items-center justify-center space-y-4 mt-24 md:mt-32">
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
                <th class="text-left py-2 px-2 text-dark-text dark:text-light-text whitespace-nowrap">S/N</th>
                <th 
                  class="text-left py-2 px-4 text-dark-text dark:text-light-text cursor-pointer whitespace-nowrap"
                  @click="toggleCategoryDropdown"
                >
                  CATEGORY
                  <span v-if="showCategoryDropdown">
                    <i class="text-xs md:text-base pi pi-angle-up"></i>
                  </span>
                  <span v-else>
                    <i class="text-xs md:text-base pi pi-angle-down"></i>
                  </span>
                </th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap sticky left-0 z-10 bg-light-bg dark:bg-darker-bg">PRODUCT</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">DESCRIPTION</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">PRICE</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">COLOR</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">SIZE</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">GRADE</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">AVAILABILITY</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">SWAP IN</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">SERIAL NO</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">SUPPLIER</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">DATE IN</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">TIME IN</th>
                <th class="text-left py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">DATE OUT</th>
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
                v-for="(inventory, index) in filteredInventory" 
                :key="index" 
                class="hover:bg-light-bg hover:dark:bg-dark-bg">
                <td class="py-2 px-2 text-dark-text dark:text-light-text whitespace-nowrap">{{ calculateIndex(index) }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.category.name }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap sticky left-0 z-10 bg-lighter-bg dark:bg-darker-bg">{{ inventory.name }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.description }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">${{ inventory.price }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.color }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.size }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.grade.name }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap" 
                    :class="{
                      'text-green-500': !inventory.isSold, 
                      'text-red-500': inventory.isSold
                    }">
                  {{ inventory.isSold ? 'Sold' : 'Available' }}
                </td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.swapIn.name }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.serialNumber }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.supplier }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ formatDateTime(inventory.dateIn).date }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ formatDateTime(inventory.dateIn).time }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">{{ inventory.dateOut }}</td>
                <td class="py-2 px-4 text-dark-text dark:text-light-text whitespace-nowrap">
                  <button @click="duplicateInventory(inventory)" class="text-indigo-900 hover:text-indigo-700">
                    <i class="text-xs md:text-base pi pi-copy"></i>
                  </button>
            
                  <button @click="openDeleteDialog(inventory)" class="ml-2 text-red-500 hover:text-red-600">
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
          style="background-color: #4c5270; color: white; border-color: #4c5270;"
          @click="currentPage > 1 && (currentPage--)" :disabled="currentPage === 1"
          class="text-xs md:text-sm p-2 rounded-md hover:scale-105 flex items-center justify-center gap-2 transition-all duration-300"
        >
          <i class="text-xs md:text-sm pi pi-angle-left"></i>
          Prev
        </button>
        <span v-if="currentPage > 1" class="text-gray-600 dark:text-gray-300 text-xs md:text-sm">
          Page {{ currentPage }} of {{ Math.ceil(store.inventory.length / itemsPerPage) }}
        </span>
        <button 
          style="background-color: #4c5270; color: white; border-color: #4c5270;"
          @click="currentPage * itemsPerPage < store.inventory.length && (currentPage++)"
          :disabled="currentPage * itemsPerPage >= store.inventory.length"
          class="text-xs md:text-sm p-2 rounded-md hover:scale-105 flex items-center justify-center gap-2 transition-all duration-300"
        >
          Next
          <i class="text-xs md:text-sm pi pi-angle-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-container::-webkit-scrollbar {
  display: none;
}

.table-container {
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>