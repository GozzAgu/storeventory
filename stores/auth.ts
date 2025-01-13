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
      const nuxtApp = useNuxtApp()
      const response = await createUserWithEmailAndPassword(nuxtApp.$auth, email, password)
      const user = response.user
      if (user) {
        this.currentUser = {...user, password: password, accountType: accountType, id: response.user.uid, adminName: adminName }
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      }
      return response
    },

    // async signupStaff(email: string, password: string, accountType: AccountType) {
    //   const nuxtApp = useNuxtApp();
    //   try {
    //     if (!this.currentUser || this.currentUser.accountType !== AccountType.admin) {
    //       throw new Error('Only admins can create staff accounts.');
    //     }
    
    //     const adminId = this.currentUser.id; // Use current user's UID
    //     const adminAccountType = this.currentUser.accountType; // Use current user's account type
    
    //     const userCredential = await createUserWithEmailAndPassword(nuxtApp.$auth, email, password);
    //     const user = userCredential.user;
    
    //     const userRef = doc(nuxtApp.$firestore, 'users', user.uid);
    
    //     await setDoc(userRef, {
    //       email,
    //       accountType,
    //       adminId, // Reference the admin who created this account
    //       createdAt: new Date(),
    //     });
    
    //     this.currentUser = {
    //       ...user,
    //       accountType,
    //       adminId,
    //       password,
    //       id: user.uid,
    //     };
    
    //     return user;
    //   } catch (error) {
    //     console.error('Error creating staff user:', error);
    //     throw error;
    //   }
    // },

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

    loadCurrentUserFromStorage() {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        this.profileImageUrl = this.currentUser.imageUrl || '';
      } else if (this.currentUser?.id) {
        this.fetchCurrentUser(this.currentUser.id); // Fetch from Firestore if not in storage
      }
    },

    async fetchCurrentUser(id:string) {
      const nuxtApp = useNuxtApp()
      try{
        if (!id) {
          throw new Error("Invalid user ID")
        }
        const userDocRef = doc(nuxtApp.$firestore, 'users',id)
        const userDocSnapshot = await getDoc(userDocRef)
        this.currentUser = userDocSnapshot.data()
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
        return this.currentUser
      }
      catch(error){
        console.log(error)
      }
    },

    authenticated() {
      const router = useRouter()
      if(!this.currentUser) {
        router.push('/auth/signin')
      }
    },

    // initAuthListener() {
    //   const nuxtApp = useNuxtApp();
    //   const auth = nuxtApp.$auth;
    //   auth.onAuthStateChanged(async (user) => {
    //     if (user) {
    //       const userRef = doc(nuxtApp.$firestore, 'users', user.uid);
    //       const userDoc = await getDoc(userRef);
  
    //       if (userDoc.exists()) {
    //         this.currentUser = { ...user, ...userDoc.data() } as typeof this.currentUser;
    //       }
    //     } else {
    //       this.currentUser = null;
    //     }
    //   });
    // },

    updateProfileImageUrl(url: string) {
      if (this.currentUser) {
        this.currentUser.imageUrl = url;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.profileImageUrl = url;
      }
    },
  },
});
