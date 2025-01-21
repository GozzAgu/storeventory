<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isDarkMode = useState('isDarkMode');
const isSidenavOpen = ref(true);
const route = useRoute();
const mobileNavOpen = ref(false);

const menuItems = [
  { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard/home' },
  { label: 'Inventory', icon: 'pi pi-file', route: '/dashboard/inventorylist' },
  { label: 'Receipts', icon: 'pi pi-receipt', route: '/dashboard/receiptlist' },
  { label: 'Customers', icon: 'pi pi-users', route: '/dashboard/customerlist' },
  { label: 'Staff', icon: 'pi pi-user-edit', route: '/dashboard/stafflist' },
  { label: 'Settings', icon: 'pi pi-cog', route: '/dashboard/settings' },
  { label: 'Help', icon: 'pi pi-question-circle', route: '/dashboard/help' },
  { label: 'Logout', icon: 'pi pi-sign-out' },
];

const isActive = (routeToCheck: string) => {
  return route.path === routeToCheck;
};

const logout = async () => {
  await authStore.logout();
};

onMounted(() => {
  if (authStore.currentUser?.id) {
    authStore.fetchCurrentUser(authStore.currentUser.id);
    console.log(authStore.currentUser?.adminName);
  }
});
</script>

<template>
  <div v-if="mobileNavOpen" 
    class="absolute inset-0 bg-black opacity-50 z-50" 
    @click="mobileNavOpen = false"
  ></div>

  <div class="flex h-screen" :class="isDarkMode ? 'bg-dark-bg text-light-text' : 'bg-light-bg text-dark-text'">
    <!-- Sidebar for large screens -->
    <div
      :class="[ 
        'transition-all duration-300', 
        isSidenavOpen ? 'w-64' : 'w-16', 
        isDarkMode ? 'bg-dark-bg text-light-text' : 'bg-light-bg text-dark-text' 
      ]"
      class="h-full shadow-lg flex flex-col lg:block hidden"
    >
      <!-- Sidebar Content -->
      <div class="flex items-center p-4 space-x-4">
        <img :src="authStore.currentUser?.imageUrl" alt="Profile" class="min-w-10 h-10 rounded-full object-cover aspect-square" />
        <span v-if="isSidenavOpen" class="text-lg font-semibold">{{ authStore.currentUser?.adminName }}</span>
      </div>

      <!-- Sidebar Toggle -->
      <div class="flex items-center justify-end p-4">
        <i
          class="pi pi-chevron-left cursor-pointer"
          :class="{ 'rotate-180': !isSidenavOpen }"
          @click="isSidenavOpen = !isSidenavOpen"
        ></i>
      </div>

      <!-- Menu Items with NuxtLink -->
      <nav class="flex flex-col space-y-4 mt-8 px-4">
        <NuxtLink
          @click="item.label === 'Logout' && logout()"
          v-for="item in menuItems"
          :key="item.label"
          :to="item.route"
          :class="[
            'flex items-center space-x-4 p-2 rounded-md cursor-pointer hover:bg-darker-bg hover:text-light-text',
            { 'bg-hover-bg text-hover-text': isActive(item.route!) }
          ]"
          exact-active-class="bg-hover-bg text-hover-text"
        >
          <i :class="item.icon" class="text-lg"></i>
          <span v-if="isSidenavOpen" class="font-medium">{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </div>

    <!-- Mobile Navbar (visible on mobile) -->
    <transition name="mobile-nav">
      <div v-show="mobileNavOpen" class="lg:hidden fixed inset-y-0 left-0 z-50 flex justify-start">
        <div 
          :class="[
            'w-64 p-4',
            isDarkMode ? 'bg-dark-bg' : 'bg-light-bg',
            'transition-all duration-300'
          ]"
        >
          <div class="flex items-center justify-end">
            <i
              class="pi pi-chevron-left cursor-pointer text-white"
              @click="mobileNavOpen = false"
            ></i>
          </div>
          <nav class="flex flex-col space-y-4 mt-8">
            <div class="flex items-center mb-4 space-x-4">
              <img :src="authStore.currentUser?.imageUrl" alt="Profile" class="min-w-10 h-10 rounded-full object-cover aspect-square" />
              <span v-if="isSidenavOpen" class="text-lg font-semibold">{{ authStore.currentUser?.adminName }}</span>
            </div>
            <NuxtLink
              @click="item.label === 'Logout' && logout()"
              v-for="item in menuItems"
              :key="item.label"
              :to="item.route"
              :class="[
                'flex items-center space-x-4 p-2 rounded-md cursor-pointer hover:bg-darker-bg hover:text-light-text',
                { 'bg-hover-bg text-hover-text': isActive(item.route!) }
              ]"
              exact-active-class="bg-hover-bg text-hover-text"
            >
              <i :class="item.icon" class="text-lg"></i>
              <span class="font-medium">{{ item.label }}</span>
            </NuxtLink>
          </nav>
        </div>
      </div>
    </transition>

    <!-- Main Content Area -->
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
          <!-- Mobile Menu Icon -->
          <i
            class="pi pi-bars text-lg cursor-pointer lg:hidden"
            @click="mobileNavOpen = !mobileNavOpen"
          ></i>
          <span class="text-xl font-black">SwiftSort</span>
        </div>

        <!-- Theme Toggle & Notifications -->
        <div class="ml-auto flex items-center space-x-4">
          <div class="relative cursor-pointer hover:text-darker-text transition-all duration-300 hover:bg-darker-bg hover:text-light-text rounded-md p-2">
            <i class="pi pi-bell text-lg"></i>
            <span class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex justify-center items-center">3</span>
          </div>

          <i
            class="text-lg cursor-pointer hover:text-darker-text transition-all duration-300 hover:bg-darker-bg hover:text-light-text rounded-md p-2"
            :class="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
            @click="isDarkMode = !isDarkMode"
          ></i>

          <i class="pi pi-user text-lg cursor-pointer transition-all duration-300 hover:bg-darker-bg hover:text-light-text rounded-md p-2"></i>
        </div>
      </div>

      <!-- Main Content (Where route components will appear) -->
      <div class="p-6 flex-1 overflow-auto">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --hover-bg: #201F2A;
  --hover-text: #CDCFD9;
}

.bg-hover-bg {
  background-color: var(--hover-bg);
}
.text-hover-text {
  color: var(--hover-text);
}

.mobile-nav-enter-active, .mobile-nav-leave-active {
  transition: transform 0.3s ease;
}
.mobile-nav-enter, .mobile-nav-leave-to{
  transform: translateX(-100%);
}
</style>