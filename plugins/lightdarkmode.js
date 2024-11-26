export default defineNuxtPlugin(nuxtApp => {
  const isDarkMode = useState('isDarkMode', () => false);

  nuxtApp.provide('toggleDarkMode', () => {
    isDarkMode.value = !isDarkMode.value;
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('isDarkMode', isDarkMode.value.toString());
  });
});