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
                class="list-articles__card"
              />
            </div>

            <div v-if="totalPages > 1" class="list-articles__paginator">
              <button
                v-for="item in totalPages"
                type="button"
                class="list-articles__paginator-item"
                :class="{
                  'list-articles__paginator-item--active': page === item,
                }"
                :key="item"
                @click="setPage(item)"
              >
                {{ item }}
              </button>
            </div>
            </div>
            <div v-else class="list-articles__empty-msg">
              <img alt="NoImg" src="@/assets/img/no.jpg">
            </div>
            <!-- <p >Список статей пуст :(</p> -->
          </TransitionGroup>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script>
import CardArticle from "@/components/CardArticle.vue";
import { mapStores } from "pinia";
import { useMainStore } from "@/store";

export default {
  components: {
    CardArticle,
  },
  props: {
    isFavorites: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      hasData: false,
      newsList: [],
      limit: 10,
      page: 1,
      totalLimit: 1,
      totalPages: 1
    }
  },
  computed: {
    ...mapStores(useMainStore),
    favoriteList() {
      return this.mainStore.favoriteList
    },
    favoritesObj() {
      return this.mainStore.favorites
    },
    computedList() {
      return this.isFavorites ? this.newsList.filter((item) => this.favoritesObj[item.id]) : this.newsList;
    }
  },
  methods:{
    getFavorites() {
      const favorites = this.$cookies.get("favorites");
      if (favorites) {
        try {
          const favoritesObj = JSON.parse(favorites);
          this.mainStore.favorites = favoritesObj
        } catch (err) {
          console.log(err);
        } finally {
          this.getNewsList();
        }
      }
    },
    getNewsList(page) {
      // if (this.isFavorites && !this.favoriteList.length) {
        this.hasData = true;
      //   return;
      // }
      this.$axios("http://192.168.93.179:5000/books", {
        params: {
          id: this.isFavorites ? this.favoriteList : [],
          _limit: this.limit,
          _page: page
        },
      }).then(
        (response) => {
          if (response) {
            this.newsList = response.data.map((item) => {
              item.description = item.body;
              delete item.body;
              return item;
            });
            this.newsList = response.data;
            this.page = page;
            this.totalCount = response.headers["x-total-count"];
            this.totalPages = Math.ceil(this.totalCount / this.limit);
          }
          this.hasData = true;
        });
    },
    setPage(page) {
      this.getNewsList(page);
    },
  },
  created(){
    this.getFavorites();
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
  &__wrapper{
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