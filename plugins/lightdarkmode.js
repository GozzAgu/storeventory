export default defineNuxtPlugin((nuxtApp) => {
  const isDarkMode = useState('isDarkMode', () => false);

  nuxtApp.provide('toggleDarkMode', () => {
    isDarkMode.value = !isDarkMode.value;

    if (process.client) {
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('isDarkMode', isDarkMode.value.toString());
    }
  });

  if (process.client) {
    const savedDarkMode = localStorage.getItem('isDarkMode');
    if (savedDarkMode === 'true') {
      isDarkMode.value = true;
      document.documentElement.classList.add('dark');
    } else {
      isDarkMode.value = false;
      document.documentElement.classList.remove('dark');
    }
  }
});