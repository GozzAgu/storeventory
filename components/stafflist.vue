<script setup lang="ts">
import Drawer from 'primevue/drawer';
import { setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, type Auth } from '@firebase/auth';
import { AccountType, type StaffData } from '~/types/auth';
import { useAuthStore } from '~/stores/auth';

const loading = ref(false);
const addDrawerVisible = ref(false);
const editDrawerVisible = ref(false);
const nuxtApp = useNuxtApp()
const isDarkMode = useState('isDarkMode');
const editMode = ref(true);
const toast = useToast();
const deleteDialogVisible = ref(false);
const authStore = useAuthStore();
const itemToDelete: Ref<{ name: string; id: string } | null> = ref(null);
const isAddingStaff = ref(false);
const newStaff = ref<StaffData>({
  id: '',
  name: '',
  email: '',
  password: '',
  position: '',
  department: '',
  accountType: AccountType.user,
  adminId: '',
});

const toggleAccountType = async (staffId: string) => {
  try {
    for (const staff of authStore.staffList) {
      if (staff.id === staffId) {
        const newAccountType = staff.accountType === AccountType.user ? AccountType.admin : AccountType.user;
        const staffRef = doc(nuxtApp.$firestore, 'users', staffId);
        await updateDoc(staffRef, {
          accountType: newAccountType
        });
        staff.accountType = newAccountType;
        break;
      }
    }
  } catch (error) {
    console.error('Error updating account type: ', error);
  }
};

const dialogBackgroundColor = computed(() =>
  isDarkMode.value ? '#201F2A' : '#FFFFFF'
);

const openCreateStaffDrawer = () => {
  newStaff.value = { id: '', name: '', email: '', password: '', position: '', department: '', accountType: AccountType.user, adminId: ''};
  addDrawerVisible.value = true;
  editDrawerVisible.value = false;
};

const closeCreateStaffDrawer = () => {
  addDrawerVisible.value = false;
  editDrawerVisible.value = false;
};

const drawerBackgroundColor = computed(() => {
  return isDarkMode.value ? '#201F2A' : '#E3E4EB';
});

const setUserAccountType = async (staffUid: string, staff: any) => {
  if (!authStore.currentUser) {
    throw new Error('Admin user is not authenticated.');
  }

  const adminId = authStore.currentUser.id;
  newStaff.value.adminId = adminId;

  const userDocRef = doc(nuxtApp.$firestore, 'users', staffUid);

  const plainStaffData: StaffData = {
  id: staffUid,
  name: staff.value.name,
  email: staff.value.email,
  password: staff.value.password,
  position: staff.value.position,
  department: staff.value.department,
  accountType: AccountType.user,
  adminName: authStore.currentUser.adminName!,
  adminId,
};

  if (authStore.currentUser.imageUrl) {
    plainStaffData.imageUrl = authStore.currentUser.imageUrl;
  }

  await setDoc(userDocRef, plainStaffData, { merge: true });
  console.log('User document created successfully:', userDocRef.firestore);
};

const addStaff = async () => {
  if (newStaff.value.name && newStaff.value.email && newStaff.value.password) {
    try {
      isAddingStaff.value = true;

      const response = await createUserWithEmailAndPassword(
        nuxtApp.$auth,
        newStaff.value.email,
        newStaff.value.password
      );

      console.log('New staff account created:', response);

      await setUserAccountType(response.user.uid, newStaff);

      if (response) {
        await signOut(nuxtApp.$auth);
        await signInWithEmailAndPassword(
          nuxtApp.$auth,
          authStore.currentUser!.email!,
          authStore.currentUser!.password
        );
      }

      toast.add({ severity: 'success', summary: 'Staff Added', detail: 'The new staff member has been added.' });
      closeCreateStaffDrawer();
    } catch (e) {
      console.error('Error adding staff:', e);
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to add staff.' });
    } finally {
      isAddingStaff.value = false;
    }
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields.' });
  }
};

const viewStaffDetails = (staffId: string) => {
  const staffToEdit = authStore.staffList.find(staff => staff.id === staffId);
  
  if (staffToEdit) {
    newStaff.value = { ...staffToEdit };
    editDrawerVisible.value = true;
  }
};

const editStaffDetails = (staffId: string) => {
  console.log(`Edit details for staff ID: ${staffId}`);
};

const closeDeleteDialog = () => {
  deleteDialogVisible.value = false;
  itemToDelete.value = { name: '', id: '' };
};

const openDeleteDialog = (staffId: { name: string; id: string }) => {
  itemToDelete.value = staffId;
  deleteDialogVisible.value = true;
};

const confirmDelete = async () => {
  console.log(itemToDelete.value)
  if (!itemToDelete.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No staff member selected for deletion.",
    });
    return;
  }

  try {
    await deleteStaff(itemToDelete.value.id);
    closeDeleteDialog();

    toast.add({
      severity: "success",
      summary: "Deleted",
      detail: `${itemToDelete.value.name} has been successfully deleted.`,
    });
  } catch (error:any) {
    console.error("Failed to delete item:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `Failed to delete staff: ${error.message}`,
    });
  }
};

const deleteStaff = async (staffId: string) => {
  try {
    if (!staffId) {
      throw new Error("Staff ID is required for deletion.");
    }
    const staffDocRef = doc(nuxtApp.$firestore, "users", staffId);

    await deleteDoc(staffDocRef);

    toast.add({
      severity: "success",
      summary: "Staff Deleted",
      detail: `The staff member with ID ${staffId} has been successfully deleted.`,
    });

    authStore.staffList = authStore.staffList.filter((staff) => staff.id !== staffId);
  } catch (error:any) {
    console.error("Error deleting staff:", error);

    toast.add({
      severity: "error",
      summary: "Deletion Failed",
      detail: `Could not delete staff member. Error: ${error.message}`,
    });
  }
};

onMounted(async () => {
  try {
    loading.value = true;
    if (authStore.currentUser?.accountType === 'SuperAdmin') {
      await authStore.fetchManagers();
    }
    loading.value = false;
  } catch (error) {
    console.error('Error loading staff list:', error);
    loading.value = false;
  }
});

</script>

<template>
  <div class="space-y-8 md:p-6 max-w-8xl mx-auto">
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
          @click="confirmDelete"
        >
          Delete
        </button>
      </div>
    </Dialog>
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg">
      <h2 class="text-sm md:text-2xl font-semibold">Staff List</h2>
      <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400">View all your staff members</p>
    </div>

    <div class="flex justify-end">
      <button
        @click="openCreateStaffDrawer"
        class="text-xs md:text-base p-2 rounded-md shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 transition-all duration-300"
        style="background-color: #4c5270; color: white; border-color: #4c5270;"
      >
        Create Staff
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center w-full h-full">
      <i class="pi pi-spinner pi-spin text-4xl text-gray-500 dark:text-gray-300"></i>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-2">
      <div v-for="staff in authStore.staffList" :key="staff.id" class="bg-lighter-bg dark:bg-darker-bg rounded-lg shadow-sm overflow-hidden md:transform md:transition-all md:hover:scale-105 hover:shadow-md md:hover:translate-y-1">
        <div class="p-4">
          <div class="border-b border-gray-800 pb-2 flex justify-between">
            <h3 class="text-sm md:text-lg font-semibold text-gray-800 dark:text-gray-100">{{ staff.name }}</h3>
            <i
              :class="staff.accountType === 'User' ? 'pi pi-lock text-gray-600 cursor-pointer' : 'pi pi-lock-open text-green-600 cursor-pointer'"
              @click="toggleAccountType(staff.id)"
            ></i>
          </div>
          <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400 pt-2">Position: {{ staff.position }}</p>
          <p class="text-xs md:text-sm mt-2 text-gray-700 dark:text-gray-300">Department: {{ staff.department }}</p>
          <p class="text-xs md:text-sm mt-2 text-gray-700 dark:text-gray-300">Role: {{ staff.accountType }}</p>

          <div class="mt-4 flex justify-between items-center">
            <button @click="viewStaffDetails(staff.id)" class="text-blue-500 hover:text-blue-600 text-xs md:text-sm">View & Edit</button>
            <button @click="openDeleteDialog(staff)" class="text-red-500 hover:text-red-600 text-xs md:text-sm">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Staff Message -->
    <div v-if="loading = false && authStore.staffList.length === 0" class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg mt-6">
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
          <label for="email" class="block text-sm font-medium text-gray-600 dark:text-gray-400">Password</label>
          <input 
          id="name" 
          v-model="newStaff.password" 
          type="password" 
          class="w-full p-2 border border-gray-300 rounded-md" 
          placeholder="Enter password" required
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
            :disabled="isAddingStaff"
            class="p-2 rounded-md shadow-md mb-4 flex items-center justify-center gap-2 transition-all duration-300"
            style="background-color: #4c5270; color: white; border-color: #4c5270;"
          >
            {{ isAddingStaff ? 'Adding...' : 'Add Staff' }}
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