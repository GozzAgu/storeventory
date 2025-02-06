<script setup lang="ts">
import Chart from 'primevue/chart';
import { useInvStore } from '@/stores/inventory';
import { useReceiptStore } from '@/stores/receipt';

const invStore = useInvStore();
const receiptStore = useReceiptStore();

const stats = computed(() => [
  { title: 'Total Inventory', value: invStore.inventory.length, icon: 'pi pi-shopping-cart', color: 'bg-blue-500' },
  { title: 'Total Receipts', value: receiptStore.receipts.length, icon: 'pi pi-check-circle', color: 'bg-green-500' },
  { title: 'Customers', value: groupedReceiptsByPhone.value.length, icon: 'pi pi-users', color: 'bg-yellow-500' },
  { title: 'Revenue', value: '$45,000', icon: 'pi pi-dollar', color: 'bg-purple-500' },
]);

const recentActivities = ref<{ description: string; time: any }[]>([]);

watch(() => invStore.inventory, (newInventory, oldInventory) => {
  if (newInventory.length > oldInventory.length) {
    const newItem = newInventory[newInventory.length - 1];
    recentActivities.value.unshift({
      description: `Product "${newItem.name}" added to inventory`,
      time: newItem.dateIn,
    });
  }
}, { deep: true });

watch(() => receiptStore.receipts, (newReceipts, oldReceipts) => {
  if (newReceipts.length > oldReceipts.length) {
    const newReceipt = newReceipts[newReceipts.length - 1];
    recentActivities.value.unshift({
      description: `New receipt issued to ${newReceipt.customer}`,
      time: newReceipt.date,
    });

    const phoneNumbers = new Set(oldReceipts.map(r => r.customerNumber));
    if (!phoneNumbers.has(newReceipt.customerNumber)) {
      recentActivities.value.unshift({
        description: `New customer registered: ${newReceipt.customer}`,
        time: newReceipt.date,
      });
    }
  }
}, { deep: true });

watch([() => invStore.inventory, () => receiptStore.receipts], () => {
  if (recentActivities.value.length > 10) {
    recentActivities.value.pop();
  }
}, { deep: true });

const groupedReceiptsByPhone = computed(() => {
  const grouped = receiptStore.receipts.reduce((acc, receipt) => {
    const phoneNumber = receipt.customerNumber;
    if (phoneNumber) {
      if (!acc[phoneNumber]) {
        acc[phoneNumber] = { phoneNumber, receipts: [] };
      }
      acc[phoneNumber].receipts.push(receipt);
    }
    return acc;
  }, {} as Record<string, { phoneNumber: string; receipts: typeof receiptStore.receipts }>);
  return Object.values(grouped);
});

const getMonthlyCounts = (data: any[], dateProp: 'dateIn' | 'date') => {
  const counts = Array(12).fill(0);
  data.forEach(item => {
    const dateValue = item[dateProp];
    if (dateValue) {
      const month = new Date(dateValue).getMonth();
      counts[month] += 1;
    }
  });
  return counts;
};

const chartData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Inventory Added',
      data: getMonthlyCounts(invStore.inventory, 'dateIn'),
      borderColor: '#42A5F5',
      backgroundColor: 'rgba(66, 165, 245, 0.2)',
      fill: true,
    },
    {
      label: 'Receipts Issued',
      data: getMonthlyCounts(receiptStore.receipts, 'date'),
      borderColor: '#66BB6A',
      backgroundColor: 'rgba(102, 187, 106, 0.2)',
      fill: true,
    }
  ],
}));

const chartOptions = {
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

onMounted(() => {
  invStore.fetchInventory();
  receiptStore.fetchReceipts();
})
</script>

<template>
  <div class="space-y-8 md:p-6 max-w-8xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        :class="`p-4 rounded-md text-white ${stat.color}`"
      >
        <div class="flex items-center space-x-4">
          <i :class="`${stat.icon} text-3xl`"></i>
          <div>
            <p class="text-2xl font-bold">{{ stat.value }}</p>
            <p class="text-sm">{{ stat.title }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-md">
      <h2 class="text-lg font-semibold mb-4">Recent Activities</h2>
      <ul class="space-y-1">
        <li
          v-for="(activity, index) in recentActivities"
          :key="index"
          class="flex justify-between items-center text-gray-600 dark:text-gray-400"
        >
          <span class="text-xs">{{ activity.description }}</span>
          <span class="text-xs text-gray-400">{{ activity.time }}</span>
        </li>
      </ul>
    </div>

    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-md">
      <h2 class="text-lg font-semibold mb-4">Performance Overview</h2>
      <Chart type="line" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
</style>
