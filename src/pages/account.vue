<template>
  <div class="page-account">
    <div class="page-account__container">
      <h1 class="page-account__title">Личный кабинет</h1>
      <div v-if="isAuthenticated">
        <PersAccount />
      </div>
      <div v-else>
        <AuthForm />
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth';
import AuthForm from '@/components/AuthForm.vue';
import PersAccount from '@/components/PersAccount.vue';

export default {
  components: {
    AuthForm,
    PersAccount,
  },
  data() {
    return {
      authStore: useAuthStore(), 
    };
  },
  computed: {
    isAuthenticated() {
      return this.authStore?.isAuthenticated || false;
    },
  },
  mounted() {
    this.authStore.checkAuth();
  },
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
