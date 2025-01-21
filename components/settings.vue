<script setup lang="ts">
import { ref } from 'vue';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from '#imports';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const username = ref('');
const isDarkMode = useState('isDarkMode');
const emailNotifications = ref(true);
const pushNotifications = ref(false);
const imageURL = ref<string>('');
const nuxtApp = useNuxtApp()
const storage = getStorage();

const handleImageUpload = async (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput?.files?.[0];
  if (file) {
    try {
      const imageRef = storageRef(storage, `profile_images/${authStore.currentUser?.id}/${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      const userDocRef = doc(nuxtApp.$firestore, 'users', authStore.currentUser?.id || '');
      await setDoc(userDocRef, { imageUrl: url }, { merge: true });
      authStore.updateProfileImageUrl(url);
      imageURL.value = url;
      console.log('Image uploaded and stored successfully:', url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }
};

const updateProfile = () => {
  console.log('Profile updated');
};

const saveNotifications = () => {
  console.log('Notification preferences saved');
};
</script>

<template>
  <div class="space-y-8 md:p-6 max-w-8xl mx-auto">
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg">
      <h2 class="text-sm md:text-2xl font-semibold mb-4">Profile Settings</h2>
      <form @submit.prevent="updateProfile">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input
              v-model="username"
              type="text"
              id="username"
              placeholder="Enter username"
              class="w-full px-4 py-2 border rounded-md"
              :class="isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text'"
            />
          </div>

          <div>
            <label for="profileImage" class="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Profile Image</label>
            <input
              type="file"
              id="profileImage"
              @change="handleImageUpload"
              class="w-full px-4 py-2 border rounded-md"
            />
            <p v-if="imageURL" class="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Image uploaded: <img :src="imageURL" alt="Profile Image" class="w-32 h-32 rounded-full" />
            </p>
          </div>

          <div class="flex justify-end">
            <button
              class="text-xs md:text-base py-2 px-4 rounded-md mb-4 transition-all duration-300"
              style="background-color: #4c5270; color: white; border-color: #4c5270;"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Notification Preferences Form -->
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg">
      <h2 class="text-sm md:text-2xl font-semibold mb-4">Notification Preferences</h2>
      <form @submit.prevent="saveNotifications">
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <input
              type="checkbox"
              id="emailNotifications"
              v-model="emailNotifications"
              class="h-5 w-5 text-blue-500 border-gray-300 rounded"
            />
            <label for="emailNotifications" class="text-xs md:text-sm text-gray-700 dark:text-gray-300">Receive Email Notifications</label>
          </div>
          <div class="flex items-center space-x-4">
            <input
              type="checkbox"
              id="pushNotifications"
              v-model="pushNotifications"
              class="h-5 w-5 text-blue-500 border-gray-300 rounded"
            />
            <label for="pushNotifications" class="text-xs md:text-sm text-gray-700 dark:text-gray-300">Enable Push Notifications</label>
          </div>
          <div class="flex justify-end">
            <button
              class="text-xs md:text-base py-2 px-4 rounded-md mb-4 transition-all duration-300"
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
