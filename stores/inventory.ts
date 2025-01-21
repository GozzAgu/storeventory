import { defineStore } from 'pinia';
import { type InventoryData} from '@/types/inventory';

export const useAuthStore = defineStore('inventory', {
  state: () => ({
    inventory: [] as InventoryData[],
  }),

  actions: {},
});