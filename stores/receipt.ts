import { defineStore } from 'pinia';
import { type ReceiptData } from '~/types/receipt';
import { collection, addDoc, doc, onSnapshot, getDoc, deleteDoc } from "firebase/firestore"

export const useReceiptStore = defineStore('receipts', {
  state: () => ({
    receipts: [] as ReceiptData[],
  }),

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
        await deleteDoc(docRef);
        console.log(`Document with ID ${id} has been deleted`);
      } catch (error) {
        console.error("Error deleting document: ", error);
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