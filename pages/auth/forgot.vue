<script lang="ts" setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
const { $toggleDarkMode } = useNuxtApp();
const isDarkMode = useState('isDarkMode');

const form = reactive({
  email: '',
  password: '',
});

const router = useRouter();
const toast = useToast();

function handleSignIn() {
  if (!form.email || !form.password) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please fill in all fields',
      life: 3000,
    });
    return;
  }

  if (form.email === 'user@example.com' && form.password === 'password') {
    toast.add({
      severity: 'success',
      summary: 'Sign In Successful',
      detail: 'Welcome back!',
      life: 3000,
    });
    router.push('/dashboard');
  } else {
    toast.add({
      severity: 'error',
      summary: 'Sign In Failed',
      detail: 'Invalid email or password',
      life: 3000,
    });
  }
}

function handleToggle() {
  $toggleDarkMode();
}
</script>

<template>
  <div
    class="flex items-center justify-center min-h-screen transition-colors duration-300"
    :class="isDarkMode ? 'bg-dark-bg text-light-text' : 'bg-light-bg text-dark-text'"
  >
    <div
      class="p-8 max-w-sm w-full text-center"
      :class="isDarkMode ? 'bg-darker-bg' : 'bg-lighter-bg'"
    >
      <h1 class="text-3xl font-bold mb-6 tracking-wide" :class="isDarkMode ? 'text-light-text' : 'text-dark-text'">
        Forgot Password
      </h1>
      <p class="text-sm mb-6" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
        Enter the email address you want the password reset link be sent to.
      </p>
      <div class="mb-4">
        <label for="email" class="block text-left mb-1" :class="isDarkMode ? 'text-light-text' : 'text-dark-text'">
          Email Address
        </label>
        <input
          v-model="form.email"
          type="email"
          id="email"
          placeholder="you@example.com"
          class="w-full px-4 py-2 border rounded-md"
          :class="isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text'"
        />
      </div>
      <button
        @click="handleSignIn"
        class="w-full py-2 rounded-md shadow-md mb-4 transition-all duration-300"
        style="background-color: #4c5270; color: white; border-color: #4c5270;"
      >
        Submit
      </button>
      <Button
        :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
        class="w-full mb-4 py-2"
        @click="handleToggle"
        style="background-color: #4c5270; color: white; border-color: #4c5270;"
      />
    </div>
  </div>
</template>