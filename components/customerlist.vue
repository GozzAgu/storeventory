<script setup lang="ts">
import { ref, computed } from 'vue';
import { useReceiptStore } from '@/stores/receipt';

const store = useReceiptStore();
const authStore = useAuthStore();
const openCustomerIndex = ref<number | null>(null);
const loading = ref(false);

const toggleCustomerDetails = (index: number) => {
  openCustomerIndex.value = openCustomerIndex.value === index ? null : index;
};

const isCustomerOpen = (index: number) => {
  return openCustomerIndex.value === index;
};

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
});

onMounted(async () => {
  if (authStore.currentUser) {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    store.fetchReceipts();
    loading.value = false;
  } else {
    console.error('No current user found');
  }
});
</script>

<template>
  <div class="max-w-8xl mx-auto">
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-md mb-8">
      <h2 class="text-sm md:text-2xl font-semibold">Customers List</h2>
      <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400">View and manage your customers</p>
    </div>

    <div v-if="loading" class="flex items-center justify-center h-[320px] md:h-[510px]">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-700"></div>
    </div>

    <div v-else-if="groupedReceiptsByPhone.length === 0" class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-md mt-6">
      <p class="text-gray-600 dark:text-gray-400">No customers added yet.</p>
    </div>

    <div v-else>
      <div v-for="(group, index) in groupedReceiptsByPhone" :key="index" class="bg-lighter-bg dark:bg-darker-bg p-4 rounded-md mb-2">
        <div class="flex justify-between items-center cursor-pointer" @click="toggleCustomerDetails(index)">
          <h3 class="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-100">
              <i v-if="isCustomerOpen(index)" class="text-xs pi pi-angle-up"></i>
              <i v-else class="text-xs pi pi-angle-down"></i>
            {{ group.receipts[0].customer }}
          </h3>
          <span class="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            {{ group.phoneNumber }}
          </span>
        </div>

        <transition name="accordion">
          <div v-if="isCustomerOpen(index)" class="mt-4 overflow-hidden">
            <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Email: {{ group.receipts[0].customerEmail }}
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