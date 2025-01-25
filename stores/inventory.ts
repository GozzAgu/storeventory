import { defineStore } from 'pinia';
import { type InventoryData } from '@/types/inventory';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

export const useInvStore = defineStore('inventory', {
  state: () => ({
    inventory: [] as InventoryData[],
  }),

  actions: {
    // This function is updated to save to Firestore
    async addInventoryItem(item: InventoryData) {
      const nuxtApp = useNuxtApp()
      try {
        const docRef = await addDoc(collection(nuxtApp.$firestore, 'inventory'), item);
        console.log("Document written with ID: ", docRef.id);
        this.inventory.push(item);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },

    // Remove an item from the inventory
    async removeInventoryItem(id: string) {
      this.inventory = this.inventory.filter((item) => item.id !== id);
    },

    async fetchInventory() {
      const nuxtApp = useNuxtApp();
      const inventoryCollection = collection(nuxtApp.$firestore, 'inventory');

      try {
        const querySnapshot = await getDocs(inventoryCollection);
        this.inventory = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Assign Firestore document ID
          ...doc.data(),
        })) as InventoryData[];
        console.log('Inventory fetched successfully:', this.inventory);
      } catch (e) {
        console.error('Error fetching inventory:', e);
      }
    },
  },
});