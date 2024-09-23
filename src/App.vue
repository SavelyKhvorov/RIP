<template>
  <div>
    <PageHeader/>
    <RouterView />
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader.vue";

export default {
  components: {
    PageHeader,
  },
  data(){
    return{}
  },
  methods:{},
  computed: {},
  created(){},
};
</script>

<style lang="less">
@keyframes flicker {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
