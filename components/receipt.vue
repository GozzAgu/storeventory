<template>
  <div class="space-y-8 p-6 max-w-4xl mx-auto">
    <!-- Receipt Header -->
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-semibold">Receipt</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">Issued on: {{ formattedDate }}</p>
        </div>
        <div>
          <button @click="downloadReceipt" class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Download PDF
          </button>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h3 class="font-medium text-gray-700 dark:text-gray-300">From:</h3>
          <p>Company Name</p>
          <p>Address</p>
          <p>Email: support@company.com</p>
        </div>
        <div>
          <h3 class="font-medium text-gray-700 dark:text-gray-300">To:</h3>
          <p>{{ customer.name }}</p>
          <p>{{ customer.address }}</p>
          <p>Email: {{ customer.email }}</p>
        </div>
      </div>
    </div>

    <!-- Receipt Line Items -->
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg">
      <h3 class="text-xl font-semibold mb-4">Receipt Details</h3>
      <table class="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th class="py-2 px-4 text-left font-medium text-gray-700 dark:text-gray-300">Description</th>
            <th class="py-2 px-4 text-left font-medium text-gray-700 dark:text-gray-300">Quantity</th>
            <th class="py-2 px-4 text-left font-medium text-gray-700 dark:text-gray-300">Unit Price</th>
            <th class="py-2 px-4 text-left font-medium text-gray-700 dark:text-gray-300">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td class="py-2 px-4">
              <input type="text" v-model="item.description" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" />
            </td>
            <td class="py-2 px-4">
              <input type="number" v-model="item.quantity" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" min="1" />
            </td>
            <td class="py-2 px-4">
              <input type="number" v-model="item.unitPrice" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" min="0" />
            </td>
            <td class="py-2 px-4">
              <span>{{ itemTotal(item) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-end mt-4">
        <button @click="addItem" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add Item</button>
      </div>
    </div>

    <!-- Receipt Summary -->
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg">
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold text-gray-700 dark:text-gray-300">Subtotal:</span>
        <span>{{ subtotal }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold text-gray-700 dark:text-gray-300">Tax (5%):</span>
        <span>{{ tax }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold text-gray-700 dark:text-gray-300">Total:</span>
        <span>{{ total }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Receipt Data
const customer = ref({
  name: 'John Doe',
  address: '1234 Elm Street, Some City, Some Country',
  email: 'john.doe@example.com',
});

const items = ref([
  { description: '', quantity: 1, unitPrice: 0 },
]);

// Computed properties for calculating totals
const subtotal = computed(() => {
  return items.value.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
});

const tax = computed(() => {
  return subtotal.value * 0.05; // Assuming 5% tax rate
});

const total = computed(() => {
  return subtotal.value + tax.value;
});

// Method to calculate item total
const itemTotal = (item: { quantity: number, unitPrice: number }) => {
  return item.quantity * item.unitPrice;
};

// Method to add a new line item
const addItem = () => {
  items.value.push({ description: '', quantity: 1, unitPrice: 0 });
};

// Method to format date
const formattedDate = new Date().toLocaleDateString();

// Method to download the receipt (example)
const downloadReceipt = () => {
  console.log('Download receipt as PDF');
};
</script>

<style scoped>
/* Add custom styling for the receipt screen */
</style>
