<script lang="ts" setup>
const { $toggleDarkMode } = useNuxtApp();
const isDarkMode = useState('isDarkMode');

function handleToggle() {
  $toggleDarkMode();
}

onMounted(() => {
  console.log(isDarkMode.value)
})
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-dark-bg text-light-text' : 'bg-light-bg text-dark-text'">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <div class="p-6">
      <h1>Welcome to SwiftSort</h1>
      <Button
        :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
        @click="handleToggle"
        severity="primary"
        class="mt-4"
        style="background-color: #555273; color: white; border-color: #555273;"
      />
    </div>
  </div>
</template>
