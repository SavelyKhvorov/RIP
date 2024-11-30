<template>
  <main class="list-favorites">
    <ListArticles :isFavorites="true" />
  </main>
</template>

<script>
import ListArticles from "@/components/ListArticles.vue";

export default {
  components: {
    ListArticles,
  }
};
</script>

<style lang="less">
</style>
