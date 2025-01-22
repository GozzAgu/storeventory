<script lang="ts" setup>
const { $toggleDarkMode } = useNuxtApp();
const isDarkMode = useState('isDarkMode');

function handleToggle() {
  $toggleDarkMode();
}

</script>

<template>
  <div
    class="flex items-center justify-center min-h-screen transition-colors duration-300"
    :class="isDarkMode ? 'bg-dark-bg text-light-text' : 'bg-light-bg text-dark-text'"
  >
    <div class="p-8 max-w-sm w-full text-center" :class="isDarkMode ? 'bg-darker-bg' : 'bg-lighter-bg'">
      <h1 class="text-3xl font-bold mb-6 tracking-wide dark:text-gray-100">Stoventory</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Effortlessly organize and streamline your inventory and transactions.
      </p>
      <NuxtLink
        to="auth/signin"
        class="duration-300 hover:shadow-lg hover:scale-105 block w-full mb-4 py-2 text-center rounded-md"
        style="background-color: #4c5270; color: white; border-color: #4c5270;"
        >
        Sign In
      </NuxtLink>
      <NuxtLink
        to="auth/signup"
        class="duration-300 hover:shadow-lg hover:scale-105 block w-full py-2 text-center rounded-md"
        style="background-color: #4c5270; color: white; border-color: #4c5270;"
        >
        Sign Up
      </NuxtLink>
      <Button
        :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
        class="duration-300 hover:shadow-lg hover:scale-105 w-full mt-4 py-2"
        @click="handleToggle"
        style="background-color: #4c5270; color: white; border-color: #4c5270;"
      />
    </div>
  </div>
</template>