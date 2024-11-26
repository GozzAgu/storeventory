import { defineStore } from 'pinia';

export const useAuthStore = defineStore('users', {
  state: () => ({
    userList: [] as Array<any>,
  }),

  actions: {},
});