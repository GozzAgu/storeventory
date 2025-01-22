<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth';
import { AccountType } from '@/types/auth';
import { doc, setDoc } from "firebase/firestore"; 

const nuxtApp = useNuxtApp()
const { $toggleDarkMode } = useNuxtApp();
const isDarkMode = useState('isDarkMode');
const authStore = useAuthStore();
const form = reactive({
  adminName: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const router = useRouter();
const toast = useToast();
const loading = ref(false);

const setUserAccountType = async (userId: string, form: any) => {
  const userDocRef = doc(nuxtApp.$firestore, 'users', userId)
  await setDoc(userDocRef, { ...form, accountType: AccountType.superAdmin, id:userId }, { merge: true })
}

async function handleSignUp() {
  if (!form.adminName || !form.email || !form.password || !form.confirmPassword) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please fill in all fields',
      life: 3000,
    });
    return;
  }

  if (form.password !== form.confirmPassword) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Passwords do not match',
      life: 3000,
    });
    return;
  }

  loading.value = true;
  try {
  const response = await authStore.signupAdmin(
    form.email, 
    form.password, 
    AccountType.superAdmin, 
    form.adminName
  );

  await setUserAccountType(response.user.uid, form);

  toast.add({
    severity: 'success',
    summary: 'Sign Up Successful',
    detail: 'Account created successfully!',
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
  } finally {
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
        Sign Up to Stoventory
      </h1>
      <p class="text-sm mb-6" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
        Effortlessly organize and streamline your inventory and transactions.
      </p>
      <div class="mb-4">
        <label for="name" class="block text-left mb-1" :class="isDarkMode ? 'text-light-text' : 'text-dark-text'">
          Name
        </label>
        <input
          v-model="form.adminName"
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
        @click="handleSignUp"
        class="duration-300 hover:shadow-lg hover:scale-105 w-full py-2 rounded-md shadow-md mb-4 flex items-center justify-center gap-2 transition-all duration-300"
        :disabled="loading"
        style="background-color: #4c5270; color: white; border-color: #4c5270;"
      >
        <Icon v-if="loading" name="svg-spinners:ring-resize" />
        <span>{{ loading ? 'Signing Up...' : 'Sign Up' }}</span>
      </button>
      <p class="text-sm mb-6" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
        Already have an account?
        <NuxtLink to="/auth/signin" class="underline" style="color: #4c5270;">
          Sign In
        </NuxtLink>
      </p>
      <Button
        :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
        class="duration-300 hover:shadow-lg hover:scale-105 w-full mb-4 py-2"
        @click="handleToggle"
        style="background-color: #4c5270; color: white; border-color: #4c5270;"
      />
    </div>
  </div>
</template>