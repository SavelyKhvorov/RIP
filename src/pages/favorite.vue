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
  },
  data() {
    return {};
  },
  computed: {},
};
</script>


<style lang="less">
</style>