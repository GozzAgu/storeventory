<script lang="ts" setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
const { $toggleDarkMode } = useNuxtApp();
const isDarkMode = useState('isDarkMode');

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
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
      :class="isDarkMode ? 'bg-gray-800' : 'bg-white'"
    >
      <h1 class="text-3xl font-bold mb-6 tracking-wide" :class="isDarkMode ? 'text-light-text' : 'text-dark-text'">
        Sign Up to SwiftSort
      </h1>
      <p class="text-sm mb-6" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
        Effortlessly organize and streamline your inventory and transactions.
      </p>
      <div class="mb-4">
        <label for="name" class="block text-left mb-1" :class="isDarkMode ? 'text-light-text' : 'text-dark-text'">
          Name
        </label>
        <input
          v-model="form.name"
          type="text"
          id="name"
          placeholder="Enter name"
          class="w-full px-4 py-2 border rounded-md"
          :class="isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text'"
        />
      </div>

      <div class="mb-4">
        <label for="email" class="block text-left mb-1" :class="isDarkMode ? 'text-light-text' : 'text-dark-text'">
          Email Address
        </label>
        <input
          v-model="form.email"
          type="email"
          id="email"
          placeholder="Enter email"
          class="w-full px-4 py-2 border rounded-md"
          :class="isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text'"
        />
      </div>

      <div class="mb-6">
        <label for="password" class="block text-left mb-1" :class="isDarkMode ? 'text-light-text' : 'text-dark-text'">
          Password
        </label>
        <input
          v-model="form.password"
          type="password"
          id="password"
          placeholder="Enter password"
          class="w-full px-4 py-2 border rounded-md"
          :class="isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text'"
        />
      </div>

      <div class="mb-6">
        <label for="confirmPassword" class="block text-left mb-1" :class="isDarkMode ? 'text-light-text' : 'text-dark-text'">
          Confirm Password
        </label>
        <input
          v-model="form.confirmPassword"
          type="password"
          id="confirmPassword"
          placeholder="Confirm password"
          class="w-full px-4 py-2 border rounded-md"
          :class="isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text'"
        />
      </div>
      <button
        @click="handleSignIn"
        class="w-full py-2 rounded-md shadow-md mb-4 transition-all duration-300"
        style="background-color: #4c5270; color: white; border-color: #4c5270;"
      >
        Sign Up
      </button>
      <p class="text-sm mb-6" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
        Already have an account?
        <NuxtLink to="/auth/signin" class="underline" style="color: #4c5270;">
          Sign In
        </NuxtLink>
      </p>
      <Button
        :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
        class="w-full mb-4 py-2"
        @click="handleToggle"
        style="background-color: #4c5270; color: white; border-color: #4c5270;"
      />
    </div>
  </div>
</template>