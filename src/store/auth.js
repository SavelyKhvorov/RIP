import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    token: null,
  }),
  actions: {
    login(userData, token) {
      this.isAuthenticated = true;

      this.token = token;

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token); 
    },
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;

      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    checkAuth() {
      const storedUser = localStorage.getItem('user');
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const token = localStorage.getItem('token'); 

      if (isAuthenticated && storedUser && token) {
        this.user = JSON.parse(storedUser);
        this.isAuthenticated = true;
        this.token = token;
      }
    },
  },
});
