import { defineStore } from 'pinia';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import { doc, setDoc, getDoc } from '@firebase/firestore';
import type { User } from 'firebase/auth';
import { AccountType } from '@/types/auth';

export const useAuthStore = defineStore('users', {
  state: () => ({
    currentUser: null as null | User & {
      password: string;
      accountType: AccountType;
      id: string;
      adminName?: string;
      imageUrl?: string;
      adminId?: string;
    },
    profileImageUrl: '',
  }),

  actions: {
    async signupAdmin(email: string, password: string, accountType: AccountType, adminName: string) {
      const nuxtApp = useNuxtApp();
      try {
        const userCredential = await createUserWithEmailAndPassword(nuxtApp.$auth, email, password);
        const user = userCredential.user;

        const userRef = doc(nuxtApp.$firestore, 'users', user.uid);
        await setDoc(userRef, {
          email,
          accountType,
          adminName,
          createdAt: new Date(),
        });

        this.currentUser = {
          ...user,
          accountType,
          adminName,
          password,
          id: user.uid,
        };

        return user;
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      }
    },

    async signupStaff(email: string, password: string, accountType: AccountType) {
      const nuxtApp = useNuxtApp();
      try {
        // Ensure the current user is an admin or authorized to create staff
        if (!this.currentUser || this.currentUser.accountType !== 'admin') {
          throw new Error('Only admins can create staff accounts.');
        }
    
        const adminId = this.currentUser.id; // Use current user's UID
        const adminAccountType = this.currentUser.accountType; // Use current user's account type
    
        // Create the new staff user
        const userCredential = await createUserWithEmailAndPassword(nuxtApp.$auth, email, password);
        const user = userCredential.user;
    
        // Reference to the staff user's Firestore document
        const userRef = doc(nuxtApp.$firestore, 'users', user.uid);
    
        // Store staff details in Firestore
        await setDoc(userRef, {
          email,
          accountType,
          adminId, // Reference the admin who created this account
          createdAt: new Date(),
        });
    
        // Optionally, update the local state if needed
        this.currentUser = {
          ...user,
          accountType,
          adminId,
          password,
          id: user.uid,
        };
    
        return user;
      } catch (error) {
        console.error('Error creating staff user:', error);
        throw error;
      }
    },

    async loginUser(email: string, password: string) {
      const nuxtApp = useNuxtApp();
      try {
        const userCredential = await signInWithEmailAndPassword(nuxtApp.$auth, email, password);
        const user = userCredential.user;

        const userRef = doc(nuxtApp.$firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          this.currentUser = { ...user, ...userDoc.data() } as typeof this.currentUser;
        } else {
          throw new Error('User data not found.');
        }

        return user;
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    },

    initAuthListener() {
      const nuxtApp = useNuxtApp();
      const auth = nuxtApp.$auth;
  
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const userRef = doc(nuxtApp.$firestore, 'users', user.uid);
          const userDoc = await getDoc(userRef);
  
          if (userDoc.exists()) {
            this.currentUser = { ...user, ...userDoc.data() } as typeof this.currentUser;
          }
        } else {
          this.currentUser = null;
        }
      });
    },

    updateProfileImageUrl(url: string) {
      if (this.currentUser) {
        this.profileImageUrl = url;
      }
    },
  },
});
