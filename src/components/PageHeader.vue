<template>
  <header class="page-header">
    <div class="page-header__container">
      <RouterLink to="/" class="page-header__logo-wrap">
        <h4 class="page-header__logo-text">
          Memememe
        </h4>
        <div class="page-header__logo-smile">)))</div>
      </RouterLink>

      <div class="page-header__search">
        <input type="text" placeholder="Search..." class="page-header__search-input" />
        <SvgSearch class="page-header__search-icon" />
      </div>
  
        <nav class="page-header__nav">
          <RouterLink
            v-for="tab in tabs"
            :key="tab.path"
            type="button"
            class="page-header__nav-item"
            :to="{ path: tab.path, query: tab.query }"
          >

          <component :is="tab.icon" />
          </RouterLink>
        </nav>
  
    </div>
  </header>
  </template>
  
<script>
import SvgAccount from "@/components/icons/SvgAccount.vue";
import SvgHeart from "@/components/icons/SvgHeart.vue";
import SvgPencil from "@/components/icons/SvgPencil.vue";
import SvgSearch from "@/components/icons/SvgSearch.vue";
import SvgSuggested from "@/components/icons/SvgSuggested.vue";

export default {
  components: {
    SvgAccount,
    SvgHeart,
    SvgPencil,
    SvgSearch,
    SvgSuggested,
  },
  
    data() {
      return {
        tabs: [
        {
            title: "Предложка",
            path: "/suggested",
            query: {},
            icon: SvgSuggested
          },
          {
            title: "Написать",
            path: "/write",
            query: {},
            icon: SvgPencil
          },
          {
            title: "Избранное",
            path: "/favorite",
            query: {},
            icon: SvgHeart
          },
          {
            title: "Личный кабинет",
            path: "/account",
            query: {},
            icon: SvgAccount
          },
        ],
      };
    },
  };
  </script>
  
  <style lang="less">
  
  .page-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: @black;
    z-index: 100;
  
    &__container {
      .container();
      height: 70px;
      display: flex;
      align-items: center;
    }
  
    &__logo-wrap {
      text-decoration: none;
      display: flex;
      align-items: center;
    }
  
    &__logo-text {
      margin-left: 10px;
      color: @white;
      font-size: 26px;
      font-family: @font2;
    }
  
    &__logo-smile {
      color: @white;
      font-size: 26px;
      font-family: @font2;
      animation: flicker 2s ease infinite;
    }
  
    &__nav {
      display: flex;
      align-items: center;
      margin-left: auto;
    }
  
    &__nav-item {
      width: 30px;
      height: 30px;
      margin: 10px;
      color: @white;
      transition: color 0.2s ease-out;
  
      &:hover {
        @media (hover: hover) {
          color: @light_gray;
        }
      }
  
      &:active,
      &--active,
      &.router-link-exact-active {
        color: @light_gray;
      }
    }

    &__search {
    flex-grow: 1;
    display: flex;
    justify-content: center;
  }

  &__search-input {
    width: 55%;
    padding: 5px 10px;
    border: 3px solid @white;
    border-radius: 30px;
    background-color: @white;
    color: @black;

    &::placeholder {
      color: @black;
    }
  }

  &__search-icon {
    width: 30px;
    height: 30px;
    margin-left: 10px;
    cursor: pointer;
    color: @white;
    transition: color 0.2s ease-out;

    &:hover {
        @media (hover: hover) {
          color: @light_gray;
        }
      }
  }

  }
  
  </style>