import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    favorites: {}
  }),
  getters: {
    listItem: (state) => (id) => {
      return state.newsList.find(item => item.id == id)
    },
    favoriteList:  (state) => {
      return Object.keys(state.favorites).map((item) => +item)
    },
  },
  actions: {
    setFavorite(id) {

      if (this.favorites[id]) {
        delete this.favorites[id]
      } else {
        this.favorites[id] = true;
      }

      this.$global.$cookies.set("favorites", JSON.stringify(this.favorites));
    }
  }
});