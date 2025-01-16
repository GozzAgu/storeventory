import { defineStore } from 'pinia';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import { doc, setDoc, getDoc, collection, onSnapshot } from '@firebase/firestore';
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
    staffList: [],
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

    loadCurrentUserFromStorage() {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        this.profileImageUrl = this.currentUser?.imageUrl || '';
      } else if (this.currentUser?.id) {
        this.fetchCurrentUser(this.currentUser.id);
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

    fetchManagers() {
      const nuxtApp = useNuxtApp();
      const querySnapshot = collection(nuxtApp.$firestore, "users");
      onSnapshot(querySnapshot, (UsersSnapshot) => {
        this.staffList = [];
        UsersSnapshot.forEach((doc) => {
          let userData = doc.data();
          console.log(userData.adminId, this.currentUser?.id);
          userData.id = doc.id;
          if ((userData.accountType === 'manager' || userData.accountType === 'midAdmin') && userData.adminId) {
            if (userData.adminId === this.currentUser?.id) {
              this.staffList.unshift(userData);
            }
          } else if (!userData.adminId) {
            console.log('no admin id');
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
