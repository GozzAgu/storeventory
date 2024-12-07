<script setup lang="ts">
import { ref, computed } from 'vue';
import Drawer from 'primevue/drawer';

const toast = useToast();
// Sample data for staff
const staffList = ref([
  { id: 'STAFF001', name: 'John Doe', email: '', position: 'Manager', department: 'Sales' },
  { id: 'STAFF002', name: 'Jane Smith', email: '', position: 'Developer', department: 'IT' },
  { id: 'STAFF003', name: 'Samuel Lee', email: '', position: 'Designer', department: 'Marketing' },
]);

// New staff data
const newStaff = ref({
  name: '',
  email: '',
  position: '',
  department: '',
});

// Drawer visibility state
const addDrawerVisible = ref(false);
const editDrawerVisible = ref(false);

// Dark mode state (you can replace this with your actual dark mode handling)
const isDarkMode = useState('isDarkMode');

// Edit mode state
const editMode = ref(true);

// Method to open the drawer
const openCreateStaffDrawer = () => {
  newStaff.value = { name: '', email: '', position: '', department: '' }; // Reset form fields
  addDrawerVisible.value = true;
};

// Method to close the drawer
const closeCreateStaffDrawer = () => {
  addDrawerVisible.value = false;
  editDrawerVisible.value = false;
};

// Method to close the drawer
const closeEditStaffDrawer = () => {
  newStaff.value = { name: '', email: '', position: '', department: '' }; // Reset form fields
  editDrawerVisible.value =false;
  addDrawerVisible.value = false;
  editMode.value = true;
}

// Computed property for background color based on dark mode
const drawerBackgroundColor = computed(() => {
  return isDarkMode.value ? '#201F2A' : '#E3E4EB'; // Adjust colors as needed
});

// Method to add staff
const addStaff = () => {
  if (newStaff.value.name && newStaff.value.email) {
    // Check if the staff member already exists based on a unique identifier (e.g., email)
    const isDuplicate = staffList.value.some(
      (staff) => staff.email === newStaff.value.email
    );

    if (isDuplicate) {
      toast.add({ severity: 'warn', summary: 'Duplicate Entry', detail: 'A staff member with this email already exists.' });
    } else {
      staffList.value.push({
        ...newStaff.value,
        id: `STAFF${(staffList.value.length + 1).toString().padStart(3, '0')}`,
      });
      toast.add({ severity: 'success', summary: 'Staff Added', detail: 'The new staff member has been added.' });
      closeCreateStaffDrawer();
    }
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields.' });
  }
};

// Method to view staff details
const viewStaffDetails = (staffId: string) => {
  // Find the staff member by ID
  const staffToEdit = staffList.value.find(staff => staff.id === staffId);
  
  if (staffToEdit) {
    // Set the newStaff data with the selected staff details
    newStaff.value = { ...staffToEdit };
    // Open the edit drawer
    editDrawerVisible.value = true;
  }
};

// Method to edit staff details
const editStaffDetails = (staffId: string) => {
  console.log(`Edit details for staff ID: ${staffId}`);
};

// Method to delete a staff member
const deleteStaff = (staffId: string) => {
  staffList.value = staffList.value.filter(staff => staff.id !== staffId);
};
</script>

<template>
  <div class="space-y-8 p-6 max-w-6xl mx-auto">
    <!-- Staff List Header -->
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg">
      <h2 class="text-2xl font-semibold">Staff List</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">View all your staff members</p>
    </div>

    <!-- Create Staff Button -->
    <div class="flex justify-end">
      <button
        @click="openCreateStaffDrawer"
        class="p-2 rounded-md shadow-md mb-4 flex items-center justify-center gap-2 transition-all duration-300"
        style="background-color: #4c5270; color: white; border-color: #4c5270;"
      >
        Create Staff
      </button>
    </div>

    <!-- Staff Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      <!-- Loop through staff members -->
      <div v-for="(staff, index) in staffList" :key="index" class="bg-lighter-bg dark:bg-darker-bg rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl hover:translate-y-1">
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">{{ staff.name }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ staff.position }}</p>
          <p class="text-sm mt-2 text-gray-700 dark:text-gray-300">{{ staff.department }}</p>

          <!-- Staff Actions -->
          <div class="mt-4 flex justify-between items-center">
            <button @click="viewStaffDetails(staff.id)" class="text-blue-500 hover:text-blue-600">View & Edit</button>
            <button @click="deleteStaff(staff.id)" class="text-red-500 hover:text-red-600">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Staff Message -->
    <div v-if="staffList.length === 0" class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg mt-6">
      <p class="text-gray-600 dark:text-gray-400">No staff members added yet.</p>
    </div>

    <!-- Create Staff Drawer -->
    <Drawer v-model:visible="addDrawerVisible" position="right" :style="{ backgroundColor: drawerBackgroundColor, width: '400px' }">
      <h3 class="text-xl font-semibold text-gray-600 dark:text-gray-400">Add New Staff</h3>
      <form @submit.prevent="addStaff" class="space-y-4 mt-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
          <input 
          id="name" 
          v-model="newStaff.name" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md" 
          placeholder="Enter name" required
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
           />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
          <input 
          id="name" 
          v-model="newStaff.email" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md" 
          placeholder="Enter staff email" required
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
           />
        </div>

        <div>
          <label for="position" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Position</label>
          <input 
          id="position" 
          v-model="newStaff.position" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" 
          placeholder="Enter position" required 
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
          />
        </div>

        <div>
          <label for="department" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Department</label>
          <input 
          id="department" 
          v-model="newStaff.department" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" 
          placeholder="Enter position" required 
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
          />
        </div>

        <div class="flex justify-end space-x-4 mt-4 fixed bottom-2 right-4">
          <button type="button" @click="closeCreateStaffDrawer" class="text-gray-500 hover:text-gray-600 -mt-2">Cancel</button>
          <button
            type="submit"
            @click="addStaff"
            class="p-2 rounded-md shadow-md mb-4 flex items-center justify-center gap-2 transition-all duration-300"
            style="background-color: #4c5270; color: white; border-color: #4c5270;"
          >
            Add Staff
          </button>
        </div>
      </form>
    </Drawer>

    <Drawer v-model:visible="editDrawerVisible" position="right" :style="{ backgroundColor: drawerBackgroundColor, width: '400px' }">
      <div class="flex justify-between">
        <h3 class="text-xl font-semibold text-gray-600 dark:text-gray-400">Staff Details</h3>
        <i @click="editMode=false" class="pi pi-pencil cursor-pointer text-gray-600 dark:text-gray-400"></i>
      </div>
      <form @submit.prevent="addStaff" class="space-y-4 mt-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
          <input 
          :disabled="editMode"
          id="name" 
          v-model="newStaff.name" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md" 
          placeholder="Enter name" required
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
           />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
          <input 
          :disabled="editMode"
          id="name" 
          v-model="newStaff.email" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md" 
          placeholder="Enter staff email" required
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
           />
        </div>

        <div>
          <label for="position" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Position</label>
          <input 
          :disabled="editMode"
          id="position" 
          v-model="newStaff.position" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" 
          placeholder="Enter position" required 
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
          />
        </div>

        <div>
          <label for="department" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Department</label>
          <input 
          :disabled="editMode"
          id="department" 
          v-model="newStaff.department" 
          type="text" 
          class="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" 
          placeholder="Enter position" required 
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
          ]"
          />
        </div>

        <div class="flex justify-end space-x-4 mt-4 fixed bottom-2 right-4">
          <button type="button" @click="closeCreateStaffDrawer" class="text-gray-500 hover:text-gray-600 -mt-2">Cancel</button>
          <button
            type="submit"
            class="p-2 rounded-md shadow-md mb-4 flex items-center justify-center gap-2 transition-all duration-300"
            style="background-color: #4c5270; color: white; border-color: #4c5270;"
          >
            Update
          </button>
        </div>
      </form>
    </Drawer>
  </div>
</template>

<style scoped>
/* Custom styling for staff cards */
.card {
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease-in-out;
}

.card img {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
  height: 160px; /* Smaller image size */
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>