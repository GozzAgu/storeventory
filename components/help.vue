<script setup lang="ts">
const isDarkMode = useState('isDarkMode');

const faqOpen = ref([false, false, false]);
const question = ref('');

const toggleFAQ = (index: number) => {
  faqOpen.value[index] = !faqOpen.value[index];
};

const submitQuestion = () => {
  console.log('Question submitted:', question.value);
  question.value = '';
};
</script>

<template>
  <div class="space-y-8 max-w-8xl mx-auto">
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-md">
      <h2 class="text-sm md:text-2xl font-semibold mb-4">Help & Support</h2>
      <p class="text-gray-600 dark:text-gray-400 text-xs md:text-sm">
        Welcome to the Help Center. Here you can find answers to frequently asked questions and reach out for further assistance.
      </p>
    </div>

    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-md">
      <h3 class="text-sm md:text-lg font-semibold mb-4">Frequently Asked Questions</h3>
      <ul class="space-y-4">
        <li>
          <button
            class="w-full text-left text-xs md:text-lg font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
            @click="toggleFAQ(1)"
          >
            How do I update my profile?
          </button>
          <p v-if="faqOpen[1]" class="mt-2 text-gray-600 dark:text-gray-400 text-xs md:text-sm">
            To update your profile, go to the "Profile Settings" section in the settings screen and modify your username, email, and password.
          </p>
        </li>
        <li>
          <button
            class="w-full text-left text-xs md:text-lg font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
            @click="toggleFAQ(2)"
          >
            How can I change notification preferences?
          </button>
          <p v-if="faqOpen[2]" class="mt-2 text-gray-600 dark:text-gray-400 text-xs md:text-sm">
            To adjust your notification preferences, navigate to the "Notification Preferences" section and toggle the desired options.
          </p>
        </li>
        <li>
          <button
            class="w-full text-left text-xs md:text-lg font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
            @click="toggleFAQ(3)"
          >
            How can I contact support?
          </button>
          <p v-if="faqOpen[3]" class="mt-2 text-gray-600 dark:text-gray-400 text-xs md:text-sm">
            If you need further assistance, feel free to submit a question using the form below or contact our support team at support@yourapp.com.
          </p>
        </li>
      </ul>
    </div>

    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-md">
      <h3 class="text-sm md:text-lg font-semibold mb-4">Submit a Question</h3>
      <form @submit.prevent="submitQuestion">
        <div class="space-y-4">
          <div>
            <label for="question" class="block font-medium text-gray-700 dark:text-gray-300 text-xs md:text-lg">Your Question</label>
            <textarea
              id="question"
              v-model="question"
              class="w-full px-4 py-2 border rounded-md"
              :class="isDarkMode ? 'bg-dark-bg border-gray-600 text-light-text' : 'bg-light-bg border-gray-300 text-dark-text'"
              rows="4"
              required
            ></textarea>
          </div>
          <div class="flex justify-end">
            <button
              class="py-2 px-4 rounded-md mb-4 transition-all duration-300 text-xs md:text-base"
              style="background-color: #4c5270; color: white; border-color: #4c5270;"
            >
              Submit Question
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
