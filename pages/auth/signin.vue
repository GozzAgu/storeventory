<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth';

const { $toggleDarkMode } = useNuxtApp();
const isDarkMode = useState('isDarkMode');
const authStore = useAuthStore();
const form = reactive({
  email: '',
  password: '',
});
const errors = reactive({
  email: '',
  password: '',
});

const router = useRouter();
const toast = useToast();
const loading = ref(false);

function validateForm() {
  errors.email = !form.email ? 'Email is required' : '';
  errors.password = !form.password ? 'Password is required' : '';
  return !errors.email && !errors.password;
}

async function handleSignIn() {
  if (!validateForm()) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please correct the highlighted fields',
      life: 3000,
    });
    return;
  }

  loading.value = true;
  try {
    await authStore.loginUser(form.email, form.password);
    toast.add({
      severity: 'success',
      summary: 'Sign In Successful',
      detail: 'Welcome back!',
      life: 3000,
    });
    router.push('/dashboard/home');
  } catch (error: any) {
    const errorMessage = error?.message || 'An unexpected error occurred';
    toast.add({
      severity: 'error',
      summary: 'Sign Up Failed',
      detail: errorMessage,
      life: 3000,
    });
  }
 finally {
    loading.value = false;
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
        Sign In to SwiftSort
      </h1>
      <p class="text-sm mb-6" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
        Effortlessly manage your inventory and transactions.
      </p>
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
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            errors.email ? 'border-red-500' : ''
          ]"
        />
        <p v-if="errors.email" class="text-sm text-red-500 mt-1 text-left">{{ errors.email }}</p>
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
          :class="[
            isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text',
            errors.password ? 'border-red-500' : ''
          ]"
        />
        <p v-if="errors.password" class="text-sm text-red-500 mt-1 text-left">{{ errors.password }}</p>
      </div>
      <button
        @click="handleSignIn"
        class="w-full py-2 rounded-md shadow-md mb-4 flex items-center justify-center gap-2 transition-all duration-300"
        :disabled="loading"
        style="background-color: #4c5270; color: white; border-color: #4c5270;"
      >
        <Icon v-if="loading" name="svg-spinners:ring-resize" />
        <span>{{ loading ? 'Signing In...' : 'Sign In' }}</span>
      </button>
      <p class="text-sm mb-6" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
        Don’t have an account?
        <NuxtLink to="/auth/signup" class="underline" style="color: #4c5270;">
          Sign Up
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
