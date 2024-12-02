<template>
  <div class="space-y-8 p-6 max-w-6xl mx-auto">
    <!-- Staff List Header -->
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg">
      <h2 class="text-2xl font-semibold">Staff List</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">View all your staff members</p>
    </div>

    <!-- Staff Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      <!-- Loop through staff members -->
      <div v-for="(staff, index) in staffList" :key="index" class="bg-lighter-bg dark:bg-darker-bg rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl hover:translate-y-1">
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">{{ staff.name }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ staff.position }}</p>
          <p class="mt-2 text-gray-700 dark:text-gray-300">{{ staff.department }}</p>

          <!-- Staff Actions -->
          <div class="mt-4 flex justify-between items-center">
            <button @click="viewStaffDetails(staff.id)" class="text-blue-500 hover:text-blue-600">View</button>
            <button @click="editStaffDetails(staff.id)" class="text-yellow-500 hover:text-yellow-600">Edit</button>
            <button @click="deleteStaff(staff.id)" class="text-red-500 hover:text-red-600">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Staff Message -->
    <div v-if="staffList.length === 0" class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg mt-6">
      <p class="text-gray-600 dark:text-gray-400">No staff members added yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Sample data for staff
const staffList = ref([
  {
    id: 'STAFF001',
    name: 'John Doe',
    position: 'Manager',
    department: 'Sales',
  },
  {
    id: 'STAFF002',
    name: 'Jane Smith',
    position: 'Developer',
    department: 'IT',
  },
  {
    id: 'STAFF003',
    name: 'Samuel Lee',
    position: 'Designer',
    department: 'Marketing',
  },
]);

// Method to view staff details
const viewStaffDetails = (staffId: string) => {
  console.log(`View details for staff ID: ${staffId}`);
  // Logic to navigate to the staff details page or open a modal
};

// Method to edit staff details
const editStaffDetails = (staffId: string) => {
  console.log(`Edit details for staff ID: ${staffId}`);
  // Logic to open a modal or navigate to an edit page
};

// Method to delete a staff member
const deleteStaff = (staffId: string) => {
  console.log(`Delete staff ID: ${staffId}`);
  // Logic to remove the staff member from the list
};
</script>

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
