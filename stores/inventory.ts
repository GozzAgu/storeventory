import { defineStore } from 'pinia';
import { type InventoryData } from '@/types/inventory';
import { collection, addDoc, doc, onSnapshot, getDoc, deleteDoc } from "firebase/firestore";

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
      const nuxtApp = useNuxtApp();
    
      if (!id) {
        console.error("Invalid ID provided for removal");
        return;
      }
    
      try {
        const docRef = doc(nuxtApp.$firestore, "inventory", id);
        await deleteDoc(docRef);
        console.log(`Document with ID ${id} has been deleted`);
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    },
    
    async fetchInventory() {
      const nuxtApp = useNuxtApp();
      const authStore = useAuthStore();
    
      if (!authStore.currentUser) {
        console.warn("No user is logged in. Cannot fetch inventory.");
        return;
      }
    
      const inventoriesCollection = collection(nuxtApp.$firestore, "inventory");
      onSnapshot(inventoriesCollection, async (snapshot) => {
        this.inventory = []; // Clear the state
    
        if (authStore.currentUser?.accountType === "SuperAdmin") {
          snapshot.forEach((doc) => {
            const inventoryData = { ...doc.data(), id: doc.id } as InventoryData;
            if (inventoryData.inventoryOf === authStore.currentUser?.id) {
              this.inventory.push(inventoryData);
            }
          });
        } else if (authStore.currentUser?.accountType === "Admin" || authStore.currentUser?.accountType === "User") {
          const managerDocRef = doc(nuxtApp.$firestore, "users", authStore.currentUser?.adminId || "");
          const managerDocSnapshot = await getDoc(managerDocRef);
    
          const adminId = managerDocSnapshot.data()?.id;
    
          if (!adminId) {
            console.warn("Admin ID not found for the current user.");
            return;
          }
    
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
    },
  },
});