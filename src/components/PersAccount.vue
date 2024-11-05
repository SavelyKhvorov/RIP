<template>
  <div class="persaccount">
    <div class="persaccount__container">
      <div class="persaccount__user">
        <div class="persaccount__prof-pic">
          <img class="persaccount__prof-pic-img" src="@/assets/img/McLovin.jpeg">
        </div>
          <p class="persaccount__username">{{ user.username }}</p>
          <button @click="toInfo" type="button" class="persaccount__btn btn">Профиль</button>
          <button @click="toArticles" type="button" class="persaccount__btn btn">Мои статьи</button>
          <button @click="logout" class="persaccount__btn btn">Выйти</button>
      </div>

      <div class="persaccount__area">
        <div v-if="handler===0" class="persaccount__info"> 
          <h2 class="persaccount__title">Информация</h2>

          <div class="persaccount__group">
            <label class="persaccount__label">Имя пользователя</label>
            <input type="username" class="persaccount__input" id="username">
          </div>

          <div class="persaccount__group">
            <label class="persaccount__label">Email</label>
            <input type="email" class="persaccount__input" id="email">
          </div>

          <div class="persaccount__group">
            <label class="persaccount__label">Пароль</label>
            <input type="password" class="persaccount__input" id="password">
          </div>

          <div class="persaccount__group">
            <label class="persaccount__label">Подтверждение пароля</label>
            <input type="passwordConfirm" class="persaccount__input" id="passwordConfirm">
          </div>

          <button @click="" class="persaccount__btn btn">Сохранить</button>

        </div>

        <div v-else class="persaccount__articles"> 
          <h2 class="persaccount__title">Мои статьи</h2>
          <div persaccount__articles-container>
            <ListArticles :isAuthor="true" />
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth';
import ListArticles from "@/components/ListArticles.vue";

export default {
  components: {
    ListArticles
  },
  data() {
    return {
      handler: 0,
      authStore: useAuthStore(),  
    };
  },
  computed: {
    user() {
      return this.authStore?.user || {};
    },
  },
  methods: {
    toInfo(){
      this.handler=0
    },
    toArticles(){
      this.handler=1
    },
    logout() {
      this.authStore.logout();
    },
  },
};
</script>

<style lang="less">
.persaccount{
  &__container {
    .container();
    // padding: 100px 100px 100px 100px;
    display: flex;
    border: solid 1px black;
    height: 500px;
  }

  &__prof-pic{
    display: inline-block;
    border-radius: 50%;
    overflow: hidden;
    width: 200px;
    height: 200px;
  }

  &__prof-pic-img{
    width:100%;
    height:100%;
    object-fit: cover;
  }

  &__user{
    display: flex;
    flex-direction: column;
    margin: 30px 30px 30px 30px;
  }

  &__username{
    font-size: 25px;
    text-align: center;
  }

  &__area{
    padding: 13px 30px 30px 40px;
    // border: solid 4px black;
    width: 100%;
    overflow: hidden; 
  }

  &__info{
    display: flex;
    flex-direction: column;
  }

  &__title{
    font-size: 30px;
    font-weight: bold;
  }

  &__group{
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
  }

  &__label{
    margin-bottom: 5px;
  }

  &__input{
    padding: 10px;
    border: 1px solid gray;
    border-radius: 4px;
    font-size: 14px;
    color: @black;

    &:focus {
      outline: none;
    }
  }

  &__btn{
    align-self: flex-end
  }

  &__articles{
    max-height: 400px; 
    overflow-y: auto;
    max-width: 100%;   
    box-sizing: border-box; 
  }

  .persaccount__articles::-webkit-scrollbar {
  width: 10px;
}

.persaccount__articles::-webkit-scrollbar-thumb {
  background-color: @black;
  border-radius: 5px;
}

.persaccount__articles::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}

  }
</style>
