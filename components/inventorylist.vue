<script setup lang="ts">
// Sample data for receipts
const receipts = ref([
  {
    receiptNumber: 'INV001',
    customerName: 'John Doe',
    total: 150.50,
    issueDate: new Date().toLocaleDateString(),
  },
  {
    receiptNumber: 'INV002',
    customerName: 'Jane Smith',
    total: 200.00,
    issueDate: new Date().toLocaleDateString(),
  },
]);

// Method to view a receipt's details
const viewReceipt = (receiptNumber: string) => {
  console.log(`View receipt details for ${receiptNumber}`);
  // Logic to navigate to the receipt details page or open a modal
};

// Method to download a receipt as PDF
const downloadReceipt = (receiptNumber: string) => {
  console.log(`Download receipt ${receiptNumber} as PDF`);
  // Logic to download the receipt as a PDF using jsPDF or similar
};
</script>

<template>
  <div class="space-y-8 p-6 max-w-8xl mx-auto">
    <!-- Receipts List Header -->
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg">
      <h2 class="text-2xl font-semibold">Inventory List</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">View all generated products</p>
    </div>

    <!-- Receipts Table -->
    <div class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg mt-6">
      <table class="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th class="py-2 px-4 text-left font-medium text-gray-700 dark:text-gray-300">Inventory #</th>
            <th class="py-2 px-4 text-left font-medium text-gray-700 dark:text-gray-300">Customer</th>
            <th class="py-2 px-4 text-left font-medium text-gray-700 dark:text-gray-300">Total</th>
            <th class="py-2 px-4 text-left font-medium text-gray-700 dark:text-gray-300">Issued On</th>
            <th class="py-2 px-4 text-left font-medium text-gray-700 dark:text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Loop through receipts -->
          <tr v-for="(receipt, index) in receipts" :key="index">
            <td class="py-2 px-4">{{ receipt.receiptNumber }}</td>
            <td class="py-2 px-4">{{ receipt.customerName }}</td>
            <td class="py-2 px-4">{{ receipt.total }}</td>
            <td class="py-2 px-4">{{ receipt.issueDate }}</td>
            <td class="py-2 px-4">
              <button @click="viewReceipt(receipt.receiptNumber)" class="text-blue-500 hover:text-blue-600">View</button>
              <button @click="downloadReceipt(receipt.receiptNumber)" class="ml-2 text-green-500 hover:text-green-600">Download</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No Receipts Message -->
    <div v-if="receipts.length === 0" class="bg-lighter-bg dark:bg-darker-bg p-6 rounded-lg mt-6">
      <p class="text-gray-600 dark:text-gray-400">No receipts generated yet.</p>
    </div>
  </div>
</template>