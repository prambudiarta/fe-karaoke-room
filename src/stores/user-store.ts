// src/stores/user.ts
import { defineStore } from 'pinia';
import { User } from 'src/interfaces/basic';
import { API_BE } from './constanta';

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: {} as User,
  }),
  getters: {
    getUserId: (state) => state.currentUser?.id,
    getUsername: (state) => state.currentUser?.username,
    getUserRole: (state) => state.currentUser?.role,
    isAuthenticated: (state) => !!state.currentUser,
  },
  actions: {
    async login(user: User) {
      const loginUrl = `${API_BE}/users/login`;
      try {
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user.username,
            password: user.password,
          }),
        });

        if (!response.ok) {
          throw new Error('Invalid username or password');
        }

        const loggedInUser = await response.json();
        this.setUser(loggedInUser);
      } catch (error) {
        console.error('Failed to login:', error);
      }
    },
    setUser(user: User) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
    },
    clearUser() {
      localStorage.removeItem('currentUser');
      this.currentUser = {} as User;
    },
    updateUserRole(role: 'user' | 'admin' | 'staff') {
      if (this.currentUser) {
        this.currentUser.role = role;
      }
    },
  },
});
