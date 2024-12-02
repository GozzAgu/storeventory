<script setup lang="ts">
import Chart from 'primevue/chart';

const stats = [
  { title: 'Total Orders', value: '1,245', icon: 'pi pi-shopping-cart', color: 'bg-blue-500' },
  { title: 'Pending Orders', value: '120', icon: 'pi pi-clock', color: 'bg-yellow-500' },
  { title: 'Completed Orders', value: '1,100', icon: 'pi pi-check-circle', color: 'bg-green-500' },
  { title: 'Revenue', value: '$45,000', icon: 'pi pi-dollar', color: 'bg-purple-500' },
];

const recentActivities = [
  { description: 'New customer registered: John Doe', time: '30 mins ago' },
  { description: 'Product "Smart Watch" added to inventory', time: '3 hours ago' },
];

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Orders',
      data: [120, 200, 300, 500, 800, 900],
      borderColor: '#42A5F5',
      backgroundColor: 'rgba(66, 165, 245, 0.2)',
      fill: true,
    },
    {
      label: 'Revenue',
      data: [200, 400, 600, 1000, 1500, 2000],
      borderColor: '#66BB6A',
      backgroundColor: 'rgba(102, 187, 106, 0.2)',
      fill: true,
    },
  ],
};

const chartOptions = {
  plugins: {
    legend: {
      position: 'top',
    },
  },
};
</script>

<template>
  <div class="space-y-6">
    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        :class="`p-4 rounded-lg text-white ${stat.color}`"
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

    <!-- Recent Activities -->
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg">
      <h2 class="text-lg font-semibold mb-4">Recent Activities</h2>
      <ul class="space-y-3">
        <li
          v-for="(activity, index) in recentActivities"
          :key="index"
          class="flex justify-between items-center text-gray-600 dark:text-gray-400"
        >
          <span>{{ activity.description }}</span>
          <span class="text-sm text-gray-400">{{ activity.time }}</span>
        </li>
      </ul>
    </div>

    <!-- Chart -->
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg">
      <h2 class="text-lg font-semibold mb-4">Performance Overview</h2>
      <Chart type="line" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
</style>
