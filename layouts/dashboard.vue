<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isDarkMode = useState('isDarkMode');
const isSidenavOpen = ref(true);
const route = useRoute();
const mobileNavOpen = ref(false);
const isDropdownOpen = ref(false);

const menuItems = computed(() => {
  const items = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard/home' },
    { label: 'Inventory', icon: 'pi pi-file', route: '/dashboard/inventorylist' },
    { label: 'Receipts', icon: 'pi pi-receipt', route: '/dashboard/receiptlist' },
    { label: 'Customers', icon: 'pi pi-users', route: '/dashboard/customerlist' },
    { label: 'Settings', icon: 'pi pi-cog', route: '/dashboard/settings' },
    { label: 'Help', icon: 'pi pi-question-circle', route: '/dashboard/help' },
    { label: 'Logout', icon: 'pi pi-sign-out' },
  ];

  if (authStore.currentUser?.accountType === 'SuperAdmin') {
    items.splice(4, 0, { label: 'Staff', icon: 'pi pi-user-edit', route: '/dashboard/stafflist' });
  }

  return items;
});

const isActive = (routeToCheck: string) => {
  return route.path === routeToCheck;
};

const logout = async () => {
  await authStore.logout();
};

watch(
  () => route.path,
  () => {
    mobileNavOpen.value = false;
  }
);

const userInitials = computed(() => {
  if (authStore.currentUser?.adminName) {
    const names = authStore.currentUser.adminName.split(' ');
    return names.map((name) => name[0]).join('');
  }
});

// const logout = async () => {
//   await authStore.logout();
// };

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.avatar-dropdown')) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  if (authStore.currentUser?.id) {
    authStore.fetchCurrentUser(authStore.currentUser.id);
    authStore.loadCurrentUserFromStorage();
  }
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
</script>

<template>
  <div v-if="mobileNavOpen" 
    class="absolute inset-0 bg-black opacity-50 z-50" 
    @click="mobileNavOpen = false"
  ></div>

  <div class="flex h-screen" :class="isDarkMode ? 'bg-dark-bg text-light-text' : 'bg-light-bg text-dark-text'">
    <div
      :class="[ 
        'transition-all duration-300', 
        isSidenavOpen ? 'w-64' : 'w-16', 
        isDarkMode ? 'bg-dark-bg text-light-text' : 'bg-light-bg text-dark-text' 
      ]"
      class="h-full shadow-lg flex-col lg:block hidden"
    >
      <div class="flex items-center p-4 space-x-4">
        <img v-if="authStore.currentUser?.imageUrl" :src="authStore.currentUser?.imageUrl" alt="Profile" class="min-w-10 h-10 rounded-full object-cover aspect-square" />
        <div v-else class="min-w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
          {{ userInitials }}
        </div>
        <span v-if="isSidenavOpen" class="text-lg font-semibold">{{ authStore.currentUser?.adminName }}</span>
      </div>

      <div class="flex items-center justify-end p-4">
        <i
          class="pi pi-chevron-left cursor-pointer"
          :class="{ 'rotate-180': !isSidenavOpen }"
          @click="isSidenavOpen = !isSidenavOpen"
        ></i>
      </div>

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
          exact-active-class="bg-hover-bg text-hover-text dark:bg-darker-bg"
        >
          <i :class="item.icon" class="text-lg"></i>
          <span v-if="isSidenavOpen" class="font-medium">{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </div>

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
              <img v-if="authStore.currentUser?.imageUrl" :src="authStore.currentUser?.imageUrl" alt="Profile" class="min-w-10 h-10 rounded-full object-cover aspect-square" />
              <div v-else class="min-w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
                {{ userInitials }}
              </div>
              <span v-if="isSidenavOpen" class="text-lg font-semibold">{{ authStore.currentUser?.adminName }}</span>
            </div>
            <NuxtLink
              @click="item.label === 'Logout' && logout()"
              v-for="item in menuItems"
              :key="item.label"
              :to="item.route"
              :class="[
                'flex items-center space-x-4 p-2 rounded-md cursor-pointer hover:bg-darker-bg hover:text-light-text text-xs',
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

    <div class="flex-1 flex flex-col overflow-x-auto">
      <div
        class="w-full h-[60px] flex items-center px-6 transition-all duration-300 py-2 md:py-4"
        :style="{
          boxShadow: isDarkMode 
            ? '0 1px 0 rgba(0, 0, 0, 0.1)' 
            : '0 1px 0 rgba(0, 0, 0, 0.1)'
        }"
        :class="isDarkMode ? 'bg-dark-bg text-light-text' : 'bg-light-bg text-dark-text'"
      >
        <div class="flex items-center space-x-4">
          <div class="lg:hidden">
            <i
              class="pi pi-bars text-lg cursor-pointer"
              @click="mobileNavOpen = !mobileNavOpen"
            ></i>
          </div>
          <span class="text-xl font-black">Storeventory</span>
        </div>

        <div class="ml-auto flex items-center space-x-4">  
          <i
            class="text-lg cursor-pointer md:hover:text-darker-text transition-all duration-300 md:hover:bg-darker-bg md:hover:text-light-text rounded-md p-2"
            :class="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
            @click="isDarkMode = !isDarkMode"
          ></i>

          <div class="relative avatar-dropdown">
            <div @click="toggleDropdown" class="cursor-pointer">
              <img v-if="authStore.currentUser?.imageUrl" :src="authStore.currentUser?.imageUrl" alt="Profile" class="min-w-10 h-10 rounded-full object-cover aspect-square" />
              <div v-else class="min-w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
                {{ userInitials }}
              </div>
            </div>

            <div
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-bg rounded-md shadow-lg z-50"
            >
              <div class="py-1 px-4">
                <p class="text-xs">{{ authStore.currentUser?.adminName }}</p>
                <p class="text-xs">{{ authStore.currentUser?.email}}</p>
                <button
                  @click="logout"
                  class="w-full text-left py-2 text-xs text-gray-700 dark:text-light-text hover:bg-gray-100 dark:hover:bg-darker-bg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-3 py-6 md:p-6 flex-1">
        <slot />
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

/* Dropdown Styles */
.avatar-dropdown {
  position: relative;
}

.avatar-dropdown .dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.avatar-dropdown .dropdown-menu button {
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #374151;
}

.avatar-dropdown .dropdown-menu button:hover {
  background-color: #f3f4f6;
}
</style>