<script setup lang="ts">
import { ref, computed } from 'vue';
import { useReceiptStore } from '@/stores/receipt';

const store = useReceiptStore();
const openCustomerIndex = ref<number | null>(null);

const toggleCustomerDetails = (index: number) => {
  openCustomerIndex.value = openCustomerIndex.value === index ? null : index;
};

const isCustomerOpen = (index: number) => {
  return openCustomerIndex.value === index;
};

// Group receipts by customer phone number
const groupedReceiptsByPhone = computed(() => {
  const grouped = store.receipts.reduce((acc, receipt) => {
    const phoneNumber = receipt.customerNumber;
    if (phoneNumber) {
      if (!acc[phoneNumber]) {
        acc[phoneNumber] = { phoneNumber, receipts: [] };
      }
      acc[phoneNumber].receipts.push(receipt);
    }
    return acc;
  }, {} as Record<string, { phoneNumber: string; receipts: typeof store.receipts }>);

  return Object.values(grouped);
});

onMounted(() => {
  store.fetchReceipts();
});
</script>

<template>
  <div class="md:p-6 max-w-8xl mx-auto">
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg mb-8">
      <h2 class="text-sm md:text-2xl font-semibold">Customers List</h2>
      <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400">View and manage your customers</p>
    </div>

    <div v-for="(group, index) in groupedReceiptsByPhone" :key="index" class="bg-lighter-bg dark:bg-darker-bg p-4 rounded-lg mb-2">
      <div class="flex justify-between items-center cursor-pointer" @click="toggleCustomerDetails(index)">
        <h3 class="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-100">
          {{ group.receipts[0].customer }} <!-- Display first customer's name -->
        </h3>
        <span class="text-xs md:text-sm text-gray-600 dark:text-gray-400">
          {{ group.phoneNumber }}
        </span>
      </div>

      <transition name="accordion">
        <div v-if="isCustomerOpen(index)" class="mt-4 overflow-hidden">
          <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Email: {{ group.receipts[0].customerEmail }} <!-- Use first receipt's email -->
          </p>

          <div v-if="group.receipts.length > 0" class="mt-4">
            <h4 class="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-100">Purchased Products</h4>
            <ul class="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <li v-for="(receipt, receiptIndex) in group.receipts" :key="receiptIndex">
                <div class="flex flex-col gap-2">
                  <span class="text-xs md:text-sm font-semibold">{{ receipt.name }}</span>
                  <span class="text-xs md:text-sm font-semibold">Serial no-{{ receipt.serialNumber }}</span>

                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>

    <!-- No Customers Message -->
    <div v-if="groupedReceiptsByPhone.length === 0" class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg mt-6">
      <p class="text-gray-600 dark:text-gray-400">No customers added yet.</p>
    </div>
  </div>
</template>

<style scoped>
.accordion-enter-active, .accordion-leave-active {
  transition: all 0.3s ease;
}
.accordion-enter, .accordion-leave-to {
  opacity: 0;
  max-height: 0;
  padding: 0;
  margin: 0;
}
.accordion-enter-to, .accordion-leave {
  opacity: 1;
  max-height: 500px;
  padding: 10px 0;
  margin: 10px 0;
}
</style>