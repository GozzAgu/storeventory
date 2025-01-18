<template>
  <div class="md:p-6 max-w-8xl mx-auto">
    <!-- Customers List Header -->
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg mb-8">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">Customers List</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">View and manage your customers</p>
    </div>

    <!-- Customer Accordion -->
    <div v-for="(customer, index) in customers" :key="index" class="bg-lighter-bg dark:bg-darker-bg p-4 rounded-lg shadow-md mb-2">
      <div class="flex justify-between items-center cursor-pointer" @click="toggleCustomerDetails(index)">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">{{ customer.name }}</h3>
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ customer.email }}</span>
      </div>

      <!-- Customer Details (Toggle visibility) -->
      <transition name="accordion">
        <div v-if="isCustomerOpen(index)" class="mt-4 overflow-hidden">
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ customer.phone }}</p>

          <!-- Customer's Products as a List -->
          <div v-if="customer.products.length > 0" class="mt-4">
            <h4 class="font-semibold text-gray-800 dark:text-gray-100">Purchased Products</h4>
            <ul class="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <!-- Loop through products -->
              <li v-for="(product, productIndex) in customer.products" :key="productIndex">
                <div class="flex justify-between items-center">
                  <span class="text-sm">{{ product.name }}</span>
                  <span class="text-sm">{{ product.price }}</span>
                </div>
              </li>
            </ul>
          </div>

          <!-- If no products -->
          <div v-else>
            <p class="text-sm text-gray-600 dark:text-gray-400">No products purchased yet.</p>
          </div>
        </div>
      </transition>
    </div>

    <!-- No Customers Message -->
    <div v-if="customers.length === 0" class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg mt-6">
      <p class="text-gray-600 dark:text-gray-400">No customers added yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Sample data for customers and products they bought
const customers = ref([
  {
    id: 'CUST001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    products: [
      {
        name: 'Product A',
        price: 150.00
      },
      {
        name: 'Product B',
        price: 200.00
      },
      {
        name: 'Product C',
        price: 250.00
      },
    ]
  },
  {
    id: 'CUST002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '098-765-4321',
    products: [
      {
        name: 'Product D',
        price: 180.00
      },
      {
        name: 'Product E',
        price: 220.00
      }
    ]
  },
]);

// Track which customer details are open
const openCustomerIndex = ref<number | null>(null);

// Toggle customer details visibility
const toggleCustomerDetails = (index: number) => {
  openCustomerIndex.value = openCustomerIndex.value === index ? null : index;
};

// Check if a customer details are open
const isCustomerOpen = (index: number) => {
  return openCustomerIndex.value === index;
};

</script>

<style scoped>
/* Smooth transition for the accordion opening and closing */
.accordion-enter-active, .accordion-leave-active {
  transition: all 0.3s ease;
}
.accordion-enter, .accordion-leave-to /* .accordion-leave-active in <2.1.8 */ {
  opacity: 0;
  max-height: 0;
  padding: 0;
  margin: 0;
}
.accordion-enter-to, .accordion-leave {
  opacity: 1;
  max-height: 500px; /* Adjust the max height based on content */
  padding: 10px 0;
  margin: 10px 0;
}
</style>
