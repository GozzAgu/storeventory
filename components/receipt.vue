<template>
  <div>
    <button @click="showModal = true" class="bg-blue-500 text-white px-4 py-2 rounded">View Receipt</button>

    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">Receipt</h2>
        
        <div class="border-b pb-2 mb-2">
          <p><strong>Customer:</strong> {{ receipt.customer }}</p>
          <p><strong>Date:</strong> {{ receipt.date }}</p>
        </div>
        
        <table class="w-full text-left mb-4">
          <thead>
            <tr>
              <th class="border-b pb-1">Item</th>
              <th class="border-b pb-1">Qty</th>
              <th class="border-b pb-1">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in receipt.items" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>${{ item.price.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="border-t pt-2">
          <p class="text-right font-bold">Total: ${{ receipt.total.toFixed(2) }}</p>
        </div>

        <button @click="showModal = false" class="mt-4 w-full bg-red-500 text-white py-2 rounded">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
const receipt = ref({
  customer: 'John Doe',
  date: new Date().toLocaleDateString(),
  items: [
    { id: 1, name: 'Item A', quantity: 2, price: 10.5 },
    { id: 2, name: 'Item B', quantity: 1, price: 20.0 },
    { id: 3, name: 'Item C', quantity: 3, price: 5.75 }
  ],
  get total() {
    return this.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }
});
</script>
