import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";

export const useMainStore = defineStore("main", {
  state: () => ({
    favorites: {},
    userArticles: [],
  }),
  getters: {
    favoriteList(state) {
      return Object.keys(state.favorites).map((id) => +id);
    },
  },
  actions: {
    async fetchFavorites() {
      const authStore = useAuthStore();
      if (authStore.token) {
        try {
          const response = await axios.get("http://192.168.0.15:80/api/favorites", {
            headers: { Authorization: `Bearer ${authStore.token}` },
          });
          this.favorites = response.data.reduce((acc, item) => {
            acc[item.id] = true;
            return acc;
          }, {});
        } catch (error) {
          console.error("Ошибка загрузки избранного:", error);
        }
      }
    },


    async fetchUserArticles() {
      const authStore = useAuthStore();
      if (authStore.token) {
        try {
          const response = await axios.get("http://192.168.0.15:80/api/articles?author=current", {
            headers: { Authorization: `Bearer ${authStore.token}` },
          });
          this.userArticles = response.data;
        } catch (error) {
          console.error("Ошибка загрузки статей пользователя:", error);
        }
      }
    },



    async addToFavorites(articleId) {
      const authStore = useAuthStore();
      if (authStore.token) {
        try {
          await axios.post(
            "http://192.168.0.15:80/api/favorites",
            { article_id: articleId },
            { headers: { Authorization: `Bearer ${authStore.token}` } }
          );
          this.favorites[articleId] = true;
        } catch (error) {
          console.error("Ошибка добавления в избранное:", error);
        }
      } else {
        console.warn("Пользователь не авторизован");
      }
    },

    async removeFromFavorites(articleId) {
      const authStore = useAuthStore();
      if (authStore.token) {
        try {
          await axios.delete(`http://192.168.0.15:80/api/favorites/${articleId}`, {
            headers: { Authorization: `Bearer ${authStore.token}` },
          });
          delete this.favorites[articleId];
        } catch (error) {
          console.error("Ошибка удаления из избранного:", error);
        }
      }
    },

    clearFavorites() {
      console.log("Очистка избранного");
      this.favorites = {}; 
    },
  },
});
