<template>
  <div :class="{ dark: isDarkMode }" class="min-h-screen transition-colors duration-300">
    <NuxtLayout>
      <Toast />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import Toast from 'primevue/toast';
import { useAuthStore } from './stores/auth';

const isDarkMode = useState('isDarkMode');
const store = useAuthStore()

onMounted(() => {
	store.loadCurrentUserFromStorage()
  const savedDarkMode = localStorage.getItem('isDarkMode') === 'true';
  isDarkMode.value = savedDarkMode;

  if (savedDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>