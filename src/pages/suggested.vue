<template>
  <div class="page-account">
    <div class="page-account__container">
      <h1 class="page-account__title">Предложенные статьи</h1>
      <ListArticles/>
    </div>
  </div>
</template>

<script>
import ListArticles from "@/components/ListArticles.vue";

export default {
  components: {
    ListArticles,
  },
  data() {
    return {};
  },
  computed: {},
};
</script>

<style lang="less">
.page-account {
  &__container {
    .container();
  }

  &__title {
    margin: 0 0 15px;
    color: @black;
  }
}
</style>
