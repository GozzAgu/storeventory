<template>
  <div :class="{ dark: isDarkMode }" class="min-h-screen transition-colors duration-300">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const isDarkMode = useState('isDarkMode');

onMounted(() => {
  const savedDarkMode = localStorage.getItem('isDarkMode') === 'true';
  isDarkMode.value = savedDarkMode;

  if (savedDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>