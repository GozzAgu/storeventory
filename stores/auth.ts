// stores/auth.ts
import { defineStore } from 'pinia';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
// import { doc, getDoc } from "firebase/firestore"
import type { User } from 'firebase/auth';

export const useAuthStore = defineStore('users', {
  state: () => ({
    currentUser: null as null | User & { password: string, accountType: string, id: string, adminName?: string, imageUrl?: string, adminId?: string },
  }),

  actions: {
    async signupAdmin(email: string, password: string, accountType: string, adminName: string) {
      const nuxtApp = useNuxtApp();
      const response = await createUserWithEmailAndPassword(nuxtApp.$auth, email, password);
      const user = response.user;
      if (user) {
        this.currentUser = { ...user, password: password, accountType: accountType, id: response.user.uid, adminName: adminName };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      }
      return response;
    },   

    async signupUser(email: string, password: string, accountType: string, adminID: string) {
      const nuxtApp = useNuxtApp();
      const response = await createUserWithEmailAndPassword(nuxtApp.$auth, email, password);
      return response;
    }, 

    // async fetchCurrentUser(id: string) {
    //   const nuxtApp = useNuxtApp();
    //   try {
    //     if (!id) {
    //       throw new Error("Invalid user ID");
    //     }
    //     const userDocRef = doc(nuxtApp.$firestore, 'users', id);
    //     const userDocSnapshot = await getDoc(userDocRef);
        
    //     if (userDocSnapshot.exists()) {
    //       this.currentUser = { ...this.currentUser, ...userDocSnapshot.data() };
    //       localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    //       return this.currentUser;
    //     } else {
    //       throw new Error("User not found");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching user:", error);
    //   }
    // },    

    // async signinUser(email: string, password: string) {
    //   const nuxtApp = useNuxtApp();
    //   const response = await signInWithEmailAndPassword(nuxtApp.$auth, email, password);
    //   const user = response.user;
    //   if (user) {
    //     this.currentUser = { ...user, password: password, id: response.user.uid };
    //     localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    //   }
    //   return response;
    // },

    // loadCurrentUserFromStorage() {
    //   const storedUser = localStorage.getItem('currentUser')
    //   if (storedUser) {
    //     this.currentUser = JSON.parse(storedUser)
    //   }
    // },
  },
});
