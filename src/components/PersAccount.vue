<template>
  <div class="persaccount">
    <div class="persaccount__container">
      <div class="persaccount__user">
        <div class="persaccount__prof-pic">
          <img class="persaccount__prof-pic-img" src="@\assets\img\McLovin.jpeg" alt="User avatar">
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
            <label class="persaccount__label">Имя пользователя: {{ user.username }}</label>
            <input type="text" v-model="newUsername" placeholder="Новое имя" class="persaccount__input" id="username">
          </div>

          <div class="persaccount__group">
            <label class="persaccount__label">Email: {{ user.email }}</label>
            <input type="email" v-model="newEmail" placeholder="Новый email" class="persaccount__input" id="email">
          </div>

          <div class="persaccount__group">
            <label class="persaccount__label">Пароль</label>
            <input type="password" v-model="newPassword" placeholder="Новый пароль" class="persaccount__input" id="password">
          </div>

          <div class="persaccount__group">
            <label class="persaccount__label">Подтверждение пароля</label>
            <input type="password" v-model="newPasswordConfirm" placeholder="Подтверждение пароля" class="persaccount__input" id="passwordConfirm">
          </div>

          <button @click="saveChanges" class="persaccount__btn btn">Сохранить</button>

        </div>

        <div v-else class="persaccount__articles"> 
          <h2 class="persaccount__title">Мои статьи</h2>
          <div persaccount__articles-container>
            <ListArticles :isOwn="true" />
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth';
import ListArticles from "@/components/ListArticles.vue";
import axios from "axios";

export default {
  components: {
    ListArticles
  },
  data() {
    return {
      handler: 0,
      authStore: useAuthStore(),  
      newUsername: '',
      newEmail: '',
      newPassword: '',
      newPasswordConfirm: ''
    };
  },
  computed: {
    user() {
      return this.authStore?.user || {};
    },
    email(){
      return this.authStore?.email || {};
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
    async saveChanges() {
      const updatedData = {};

      if (this.newUsername) {
        updatedData.username = this.newUsername;
      }
      if (this.newEmail) {
        updatedData.email = this.newEmail;
      }
      if (this.newPassword && this.newPassword === this.newPasswordConfirm) {
        updatedData.password = this.newPassword;
      } else if (this.newPassword && this.newPassword !== this.newPasswordConfirm) {
        alert("Пароли не совпадают");
        return;
      }

      try {
        const response = await axios.put(`http://192.168.0.15:80/api/profile`, updatedData, {
          headers: { Authorization: `Bearer ${this.authStore.token}` }
        });


        if (response.status === 200) {
          this.authStore.updateUser({...updatedData});
          alert("Данные успешно обновлены");
          
          this.newUsername = '';
          this.newEmail = '';
          this.newPassword = '';
          this.newPasswordConfirm = '';
        }
      } catch (error) {
        alert("Ошибка при обновлении данных пользователя");
        console.error(error);
      }
    },
  }
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
    max-height: 450px; 
    height: 100%;
    overflow-y: auto;
    max-width: 100%;   
    box-sizing: border-box; 
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


  }
</style>
