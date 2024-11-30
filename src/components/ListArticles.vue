<template>
  <main class="list-articles">
    <Transition>
      <div v-if="hasData" class="list-articles__container">
        <div class="list-articles__wrapper">
          <TransitionGroup>
            <div v-if="computedList.length" class="list-articles__list-wrapper">
              <div class="list-articles__list">
                <CardArticle
                  v-for="item in computedList"
                  :key="item.id"
                  :id="item.id"
                  :title="item.title"
                  :description="item.description"
                  :isFavorite="favoritesObj[item.id]"
                  @toggleFavorite="toggleFavorite"
                  class="list-articles__card"
                />
              </div>
            </div>
            <div v-else class="list-articles__empty-msg">
              <img alt="NoImg" src="@/assets/img/no.jpg">
            </div>
          </TransitionGroup>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script>
import CardArticle from "@/components/CardArticle.vue";
import { useMainStore } from "@/store";
import { useAuthStore } from '@/store/auth';

export default {
  components: {
    CardArticle,
  },
  props: {
    isFavorites: {
      type: Boolean,
      default: false,
    },
    isOwn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hasData: false,
      newsList: [], // Список всех новостей
    };
  },
  computed: {
    mainStore() {
      return useMainStore(); // Получаем хранилище
    },
    favoriteList() {
      return this.mainStore.favoriteList;
    },
    favoritesObj() {
      return this.mainStore.favorites;
    },
    userId() {
      const authStore = useAuthStore();
      return authStore.user?.id || null; 
    },
    // computedList() {
    //   return this.isFavorites
    //     ? this.newsList.filter((item) => this.favoritesObj[item.id])
    //     : this.newsList;
    // },
    computedList() {
      const authStore = useAuthStore();

      let list = this.newsList;

      if (this.isFavorites) {
        list = list.filter((item) => this.favoritesObj[item.id]);
      }
      if (this.isOwn) {
        list = list.filter((item) => item.user.id && item.user.id === authStore.user?.id);
      }

      return list || []; 
    }
  },
  methods: {
    async getFavorites() {
      await this.mainStore.fetchFavorites(); 
    },
    async getNewsList() {
      try {
        const response = await this.$axios.get("http://192.168.0.15:80/api/get_articles");
        if (Array.isArray(response.data)) {
          this.newsList = response.data.map((item) => ({
            ...item,
            description: item.content, 
          }));
          this.hasData = true;
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        this.hasData = false;
      }
    },
    toggleFavorite(articleId) {
      if (this.favoritesObj[articleId]) {
        this.mainStore.removeFromFavorites(articleId);
      } else {
        this.mainStore.addToFavorites(articleId);
      }
    },
  },
  created() {
    this.getFavorites();
    this.getNewsList();
  },
};
</script>


<style lang="less">
.list-articles {
  &__container {
    .container();
  }
  &__card {
    margin-bottom: 15px;
  }
  &__wrapper {
    position: relative;
    padding-top: 5px;
  }
  &__empty-msg {
    position: absolute;
    margin: 0 auto;
    text-align: center;
    font-size: 20px;
    left: 0;
    right: 0;
  }
  &__paginator {
    display: flex;
  }
  &__paginator-item {
    list-style: none;
    padding: 5px;
    background-color: @black;
    color: @white;
    cursor: pointer;
    transition: background-color 0.2s;
    & + & {
      margin-left: 5px;
    }
    &:hover {
      @media (hover: hover) {
        background-color: @white;
        box-shadow: inset 0 0 0 2px black;
        color: @black;
      }
    }
    &:active {
      background-color: @white;
      box-shadow: inset 0 0 0 2px black;
      color: @black;
    }
    &--active {
      background-color: @white;
      box-shadow: inset 0 0 0 2px black;
      color: @black;
    }
  }
}
</style>
