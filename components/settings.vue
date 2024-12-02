<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const email = ref('');
const password = ref('');
const isDarkMode = useState('isDarkMode');
const emailNotifications = ref(true);
const pushNotifications = ref(false);
const language = ref('en');

const updateProfile = () => {
  console.log('Profile updated');
};

const saveNotifications = () => {
  console.log('Notification preferences saved');
};
</script>

<template>
  <div class="space-y-8 p-6 max-w-4xl mx-auto">
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg">
      <h2 class="text-2xl font-semibold mb-4">Profile Settings</h2>
      <form @submit.prevent="updateProfile">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input
              v-model="username"
              type="username"
              id="username"
              placeholder="Enter username"
              class="w-full px-4 py-2 border rounded-md"
              :class="isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text'"
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              v-model="email"
              type="email"
              id="email"
              placeholder="Enter email"
              class="w-full px-4 py-2 border rounded-md"
              :class="isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text'"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="Enter password"
              class="w-full px-4 py-2 border rounded-md"
              :class="isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text'"
            />
          </div>
          <div class="flex justify-end">
            <button
              class="py-2 px-4 rounded-md mb-4 transition-all duration-300"
              style="background-color: #4c5270; color: white; border-color: #4c5270;"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg">
      <h2 class="text-2xl font-semibold mb-4">Notification Preferences</h2>
      <form @submit.prevent="saveNotifications">
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <input
              type="checkbox"
              id="emailNotifications"
              v-model="emailNotifications"
              class="h-5 w-5 text-blue-500 border-gray-300 rounded"
            />
            <label for="emailNotifications" class="text-sm text-gray-700 dark:text-gray-300">Receive Email Notifications</label>
          </div>
          <div class="flex items-center space-x-4">
            <input
              type="checkbox"
              id="pushNotifications"
              v-model="pushNotifications"
              class="h-5 w-5 text-blue-500 border-gray-300 rounded"
            />
            <label for="pushNotifications" class="text-sm text-gray-700 dark:text-gray-300">Enable Push Notifications</label>
          </div>
          <div class="flex justify-end">
            <button
              class="py-2 px-4 rounded-md mb-4 transition-all duration-300"
              style="background-color: #4c5270; color: white; border-color: #4c5270;"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>