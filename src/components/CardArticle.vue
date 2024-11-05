<template>
  <div class="card-article">
    <SvgHeart class="card-article__favorite" :class="{ 'card-article__favorite--active': mainStore.favorites[id] }" 
    @click="mainStore.setFavorite(id)"
    />
    <h4
      class="card-article__title"
      @click="$router.push({ name: 'Article', params: { id: id } })"
    >
      {{ title }}
    </h4>

    <p class="card-article__description">
      {{ description }}
    </p>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useMainStore } from "@/store";
import SvgHeart from "@/components/icons/SvgHeart.vue";

export default {
  components: {
    SvgHeart,
  },
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapStores(useMainStore)
  }
};
</script>

<style lang="less">
.card-article {
  box-sizing: border-box;
  position: relative;
  padding: 20px 30px 20px 15px;
  border: 3px solid;
  background-color: @white;

  &__title {
    margin: 0 0 10px;
    color: @black;
    font-size: 20px;
    cursor: pointer;
  }

  &__favorite {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      @media (hover: hover){
        color: red;
      }
    }

    &:active,
    &--active{
        color: red;
    }
  }

  &__description {
    margin: 0 0 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>