<template>
  <div class="blog-article">
    <div class="blog-article__container">
      <h2 class="blog-article__title">{{ listItem.title }}</h2>

      <div class="blog-article__author">{{ listItem.author }}</div>

      <div class="blog-article__sections">
        <div
          class="blog-article__sections-item"
          v-for="item in listItem.sections"
          :key="item"
        >
          {{ item }}
        </div>
      </div>

      <p class="blog-article__text">
        {{ listItem.description }}
      </p>
    </div>
  </div>
</template>

<script>
import newsList from "@/json/news.json";

export default {
  data() {
    return {
      newsList: newsList,
    };
  },
  computed: {
    listItem() {
      return (
        this.newsList.find((item) => this.$route.params.id == item.id) || {}
      );
    },
  },
};
</script>

<style lang="less">
.blog-article {
  &__container {
    .container();
  }

  &__title {
    margin: 0 0 10px;
    color: @black;
  }

  &__author {
    margin-bottom: 10px;
    text-decoration: underline;
    font-size: 14px;
  }

  &__sections {
    margin-bottom: 15px;
    display: flex;
  }

  &__sections-item {
    margin-right: 10px;
    padding: 5px 10px;
    background-color: @white;
    border: 1px solid @black;
    border-radius: 5px;
  }

  &__text {
    line-height: 24px;
    font-size: 18px;
  }
}
</style>