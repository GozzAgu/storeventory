<script lang="ts" setup>
import { ref } from 'vue';

const { $toggleDarkMode } = useNuxtApp();
const isDarkMode = useState('isDarkMode');

function handleToggle() {
  $toggleDarkMode();
}
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6">
    Welcome to SwiftSort
    <Button
      :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
      @click="handleToggle"
      severity="primary"
      class="mt-4"
    />
  </div>
</template>
