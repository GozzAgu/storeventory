import { defineStore } from 'pinia';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@firebase/auth';
import { doc, updateDoc, getDoc, collection, onSnapshot } from '@firebase/firestore';
import type { User } from 'firebase/auth';
import { AccountType, type StaffData } from '@/types/auth';

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
    staffList: [] as StaffData[],
  }),

  actions: {
    async signupAdmin(email: string, password: string, accountType: AccountType, adminName: string) {
      const nuxtApp = useNuxtApp()
      const response = await createUserWithEmailAndPassword(nuxtApp.$auth, email, password)
      const user = response.user
      if (user) {
        this.currentUser = {...user, password: password, accountType: accountType, id: response.user.uid, adminName: adminName }
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      }
      return response
    },

    async loginUser(email: string, password: string, accountType: AccountType) {
      const nuxtApp = useNuxtApp()
      const response = await signInWithEmailAndPassword(nuxtApp.$auth, email, password)
      const user = response.user
      if (user) {
        this.currentUser = {...user, password: password, accountType: accountType, id: response.user.uid }
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      }
      return user
    },

    async logout() {
      const nuxtApp = useNuxtApp();
      try {
        await signOut(nuxtApp.$auth);
        this.currentUser = null;
        this.profileImageUrl = '';
        localStorage.removeItem('currentUser');
        useRouter().push('/auth/signin');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },

    loadCurrentUserFromStorage() {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        this.profileImageUrl = this.currentUser?.imageUrl || '';
      } else if (this.currentUser?.id) {
        this.fetchCurrentUser(this.currentUser.id);
      }
    },

    async fetchCurrentUser(id: string) {
      const nuxtApp = useNuxtApp();
      try {
        if (!id) {
          throw new Error("Invalid user ID");
        }
        const userDocRef = doc(nuxtApp.$firestore, 'users', id);
        const userDocSnapshot = await getDoc(userDocRef);
    
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          this.currentUser = {
            ...userData,
            emailVerified: false,
            isAnonymous: false,
            metadata: {},
            id,
          } as User & {
            password: string;
            accountType: AccountType;
            id: string;
            adminName?: string;
            imageUrl?: string;
            adminId?: string;
          };
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
          throw new Error('User document does not exist.');
        }
        return this.currentUser;
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    },

    async updateAccountType(userId: string, newAccountType: AccountType) {
      const nuxtApp = useNuxtApp();
      try {
        const userDocRef = doc(nuxtApp.$firestore, 'users', userId);
        await updateDoc(userDocRef, {
          accountType: newAccountType,
        });
        console.log('Account type updated successfully.');
      } catch (error) {
        console.error('Error updating account type:', error);
      }
    },

    fetchManagers() {
      const nuxtApp = useNuxtApp();
      const querySnapshot = collection(nuxtApp.$firestore, "users");
      onSnapshot(querySnapshot, (UsersSnapshot) => {
        this.staffList = [];
        UsersSnapshot.forEach((doc) => {
          let userData = doc.data();
          userData.id = doc.id;
          if (userData.adminId === this.currentUser?.id) {
            this.staffList.unshift(userData as StaffData);
          }
        });
      });
    },    

    authenticated() {
      const router = useRouter()
      if(!this.currentUser) {
        router.push('/auth/signin')
      }
    },

    updateProfileImageUrl(url: string) {
      if (this.currentUser) {
        this.currentUser.imageUrl = url;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.profileImageUrl = url;
      }
    },
  },
});
