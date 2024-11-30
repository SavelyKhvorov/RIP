import { defineStore } from 'pinia';
import { useMainStore } from './index'; 

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    token: null,
  }),
  actions: {
    updateUser(updatedData) {
      this.user = { ...this.user, ...updatedData };
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    login(userData, token) {
      this.isAuthenticated = true;
      this.user = userData;
      this.token = token;

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
    },
    logout() {
      console.log("Выход: удаляем токен и очищаем данные пользователя");
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;

      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      // Очистка избранного через mainStore
      const mainStore = useMainStore();
      mainStore.clearFavorites(); // Вызов метода для очистки избранного
    },
    checkAuth() {
      const storedUser = localStorage.getItem('user');
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const token = localStorage.getItem('token');

      if (isAuthenticated && storedUser && token) {
        this.user = JSON.parse(storedUser);
        this.isAuthenticated = true;
        this.token = token;
      } else {
        this.logout();
      }
    },
  },
  persist: {
    afterRestore: (context) => {
      context.store.checkAuth();
    },
  },
});
