import { defineStore } from 'pinia';
import { type InventoryData } from '@/types/inventory';
import { collection, addDoc, doc, onSnapshot, getDoc } from "firebase/firestore"

export const useInvStore = defineStore('inventory', {
  state: () => ({
    inventory: [] as InventoryData[],
  }),

  actions: {
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

    async removeInventoryItem(id: string) {
      this.inventory = this.inventory.filter((item) => item.id !== id);
    },

    async fetchInventory() {
      const nuxtApp = useNuxtApp();
      const authStore = useAuthStore();
    
      if (!authStore.currentUser) return;
    
      const inventoriesCollection = collection(nuxtApp.$firestore, "inventory");
      onSnapshot(inventoriesCollection, async (snapshot) => {
        this.inventory = []; // Clear the state
    
        const currentUser = authStore.currentUser;
    
        if (authStore.currentUser?.accountType === 'SuperAdmin') {
          snapshot.forEach((doc) => {
            const inventoryData = { ...doc.data(), id: doc.id } as InventoryData;
            if (inventoryData.inventoryOf === authStore.currentUser?.id) {
              this.inventory.push(inventoryData);
            }
          });
        } else if (authStore.currentUser?.accountType === 'Admin' || authStore.currentUser?.accountType === 'User') {
          const managerDocRef = doc(nuxtApp.$firestore, 'users', authStore.currentUser?.adminId);
          const managerDocSnapshot = await getDoc(managerDocRef);
          const adminId = managerDocSnapshot.data()?.id;
    
          if (!adminId) return;
    
          snapshot.forEach((doc) => {
            const inventoryData = { ...doc.data(), id: doc.id } as InventoryData;
            if (
              inventoryData.inventoryOf === authStore.currentUser?.uid ||
              inventoryData.inventoryOf === adminId
            ) {
              this.inventory.push(inventoryData);
            }
          });
        }
      });
    }
    
  },
});