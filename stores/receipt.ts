import { defineStore } from 'pinia';
import { type ReceiptData } from '~/types/receipt';
import { collection, addDoc, doc, onSnapshot, getDoc, deleteDoc, query, where, getDocs, updateDoc } from "firebase/firestore"

export const useReceiptStore = defineStore('receipts', {
  state: () => ({
    receipts: [] as ReceiptData[],
  }),

  getters: {
    totalRevenue: (state) => {
      const total = state.receipts.reduce((total, receipt) => {
        return total + parseFloat(receipt.amount);
      }, 0);
  
      return total.toLocaleString('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },

  actions: {
    async addReceipt(item: ReceiptData) {
      const nuxtApp = useNuxtApp()
      try {
        const docRef = await addDoc(collection(nuxtApp.$firestore, 'receipts'), item);
        console.log("Document written with ID: ", docRef.id);
        this.receipts.push(item);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },

    async removeReceiptItem(id: string) {
      const nuxtApp = useNuxtApp();
    
      if (!id) {
        console.error("Invalid ID provided for removal");
        return;
      }
    
      try {
        const docRef = doc(nuxtApp.$firestore, "receipts", id);
        
        const receiptSnapshot = await getDoc(docRef);
        if (!receiptSnapshot.exists()) {
          console.warn(`Receipt with ID ${id} not found`);
          return;
        }
    
        const receiptData = receiptSnapshot.data();
    
        await deleteDoc(docRef);
        console.log(`Receipt with ID ${id} has been deleted`);
    
        if (receiptData.serialNumber) {
          const inventoryRef = collection(nuxtApp.$firestore, "inventory");
          const inventoryQuery = query(inventoryRef, where("serialNumber", "==", receiptData.serialNumber));
          const inventorySnapshot = await getDocs(inventoryQuery);
    
          if (!inventorySnapshot.empty) {
            const inventoryDoc = inventorySnapshot.docs[0];
            const inventoryItemRef = doc(nuxtApp.$firestore, "inventory", inventoryDoc.id);
    
            await updateDoc(inventoryItemRef, { isSold: false, dateOut: '--' });
            console.log(`Inventory item with serial number ${receiptData.serialNumber} marked as not sold.`);
          } else {
            console.warn("No matching inventory found for serial number:", receiptData.serialNumber);
          }
        }
    
        // Refresh the inventory store
        await useInvStore().fetchInventory();
      } catch (error) {
        console.error("Error deleting receipt and updating inventory: ", error);
      }
    },
    
    
    async fetchReceipts() {
      const nuxtApp = useNuxtApp();
      const authStore = useAuthStore();
    
      if (!authStore.currentUser) {
        console.warn("No user is logged in. Cannot fetch inventory.");
        return;
      }
    
      const receiptsCollection = collection(nuxtApp.$firestore, "receipts");
      onSnapshot(receiptsCollection, async (snapshot) => {
        this.receipts = [];
    
        if (authStore.currentUser?.accountType === "SuperAdmin") {
          snapshot.forEach((doc) => {
            const receiptData = { ...doc.data(), id: doc.id } as ReceiptData;
            if (receiptData.receiptOf === authStore.currentUser?.id) {
              this.receipts.push(receiptData);
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
            const receiptData = { ...doc.data(), id: doc.id } as ReceiptData;
            if (
              receiptData.receiptOf === authStore.currentUser?.uid ||
              receiptData.receiptOf === adminId
            ) {
              this.receipts.push(receiptData);
            }
          });
        }
      });
    },
  },
});