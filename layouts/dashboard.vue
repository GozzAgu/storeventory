<script setup lang="ts">
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import { ref } from 'vue';

const isDarkMode = useState('isDarkMode');
const isSidenavOpen = ref(true);

const menuItems = [
  { label: 'Dashboard', icon: 'pi pi-home' },
  { label: 'Invoice', icon: 'pi pi-file' },
  { label: 'Receipts', icon: 'pi pi-receipt' },
  { label: 'Customers', icon: 'pi pi-users' },
  { label: 'Staff', icon: 'pi pi-user-edit' },
  { label: 'Settings', icon: 'pi pi-cog' },
  { label: 'Help', icon: 'pi pi-question-circle' },
  { label: 'Logout', icon: 'pi pi-sign-out' },
];

const userProfile = {
  name: 'Business 1',
  imageUrl: 'https://via.placeholder.com/150',
};

</script>

<template>
  <div class="flex h-screen" :class="isDarkMode ? 'bg-dark-bg text-light-text' : 'bg-light-bg text-dark-text'">
    <div
      :class="[ 
        'transition-all duration-300', 
        isSidenavOpen ? 'w-64' : 'w-16', 
        isDarkMode ? 'bg-dark-bg text-light-text' : 'bg-light-bg text-dark-text' 
      ]"
      class="h-full shadow-lg flex flex-col"
    >
      <div class="flex items-center p-4 space-x-4">
        <img :src="userProfile.imageUrl" alt="Profile" class="w-12 h-12 rounded-full object-cover" />
        <span v-if="isSidenavOpen" class="text-lg font-semibold">{{ userProfile.name }}</span>
      </div>

      <div class="flex items-center justify-end p-4">
        <i
          class="pi pi-chevron-left cursor-pointer"
          :class="{ 'rotate-180': !isSidenavOpen }"
          @click="isSidenavOpen = !isSidenavOpen"
        ></i>
      </div>

      <nav class="flex flex-col space-y-4 mt-8 px-4">
        <div
          v-for="item in menuItems"
          :key="item.label"
          class="flex items-center space-x-4 p-2 rounded-md cursor-pointer hover:bg-gray-200"
          :class="isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'"
        >
          <i :class="item.icon" class="text-lg"></i>
          <span v-if="isSidenavOpen" class="font-medium">{{ item.label }}</span>
        </div>
      </nav>
    </div>

    <div class="flex-1 flex flex-col">
      <div
        class="w-full h-[60px] flex items-center px-6 transition-all duration-300"
        :style="{
          boxShadow: isDarkMode 
            ? '0 1px 0 rgba(0, 0, 0, 0.1)' 
            : '0 1px 0 rgba(0, 0, 0, 0.1)'
        }"
        :class="isDarkMode ? 'bg-dark-bg text-light-text' : 'bg-light-bg text-dark-text'"
      >
        <div class="flex items-center space-x-4">
          <span class="text-xl font-black">SwiftSort</span>
        </div>

        <div class="ml-auto flex items-center space-x-6">
          <!-- Search Bar -->
          

          <div class="relative cursor-pointer hover:text-blue-500 transition-all duration-300">
            <i class="pi pi-bell text-lg"></i>
            <span
              class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex justify-center items-center"
            >
              3
            </span>
          </div>

          <i
            class="text-lg cursor-pointer hover:text-blue-500 transition-all duration-300"
            :class="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
            @click="isDarkMode = !isDarkMode"
          ></i>

          <i class="pi pi-user text-lg cursor-pointer hover:text-blue-500 transition-all duration-300"></i>
        </div>
      </div>

      <div class="p-6 flex-1 overflow-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
nav div:hover {
  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
  background-color: var(--hover-bg);
  color: var(--hover-text);
  transform: scale(1.05);
}

:root {
  --hover-bg: #201F2A;
  --hover-text: #CDCFD9;
}
</style>
