<template>
  <form class="form">
    <div class="form__container">
      <div v-show="step === 1" class="step">
        <div class="form__group">
          <label class="form__label" for="login">Логин</label>
          <input v-model="login" type="text" class="form-control" id="login">
        </div>

        <div class="form__group">
          <label class="form__label" for="password">Пароль</label>
          <input v-model="password" type="password" class="form-control" id="password">
        </div>

        <button @click="loginUser" type="button" class="form__btn">Войти</button>
        <button @click="nextStep" type="button" class="form__btn">Ещё нет аккаунта</button>
        <a @click="goToForgotPassword" class="form__link">Забыли пароль?</a>
      </div>

      <div v-show="step === 2" class="step">
        <div class="form__group">
          <label class="form__label" for="registerLogin">Логин</label>
          <input v-model="registerLogin" type="text" class="form-control" id="registerLogin">
        </div>

        <div class="form__group">
          <label class="form__label" for="registerEmail">Email</label>
          <input v-model="registerEmail" type="text" class="form-control" id="registerEmail">
        </div>

        <div class="form__group">
          <label class="form__label" for="registerPassword">Пароль</label>
          <input v-model="registerPassword" type="password" class="form-control" id="registerPassword">
        </div>

        <div class="form__group">
          <label class="form__label" for="passwordConfirm">Подтверждение пароля</label>
          <input v-model="passwordConfirm" type="password" class="form-control" id="passwordConfirm">
        </div>

        <button @click="registerUser" type="button" class="form__btn">Зарегистрироваться</button>
        <button @click="prevStep" type="button" class="form__btn">Назад</button>
      </div>

      <div v-show="step === 3" class="step">
        <div class="form__group">
          <label class="form__label" for="forgotEmail">Введите ваш Email</label>
          <input v-model="forgotEmail" type="text" class="form-control" id="forgotEmail">
        </div>

        <button @click="sendForgotPasswordRequest" type="button" class="form__btn">Отправить ссылку</button>
        <button @click="prevStep" type="button" class="form__btn">Назад</button>
      </div>

    </div>
  </form>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/store/auth';


export default {
  data() {
    return {
      step: 1,
      login: '',
      password: '',
      registerLogin: '',
      registerEmail: '',
      registerPassword: '',
      passwordConfirm: '',
      authStore: null,
    };
  },
  methods: {
    nextStep() {
      this.step++;
    },
    prevStep() {
      this.step = 1;
    },
    goToForgotPassword() {
      this.step = 3;  
    },
    async loginUser() {
      const authStore = useAuthStore();
      const token = authStore.token;
      console.log("Token:", token);
      try {
        const response = await axios.post('http://192.168.0.15:80/api/login', {
          username: this.login,
          password: this.password
        });

        const { token, userId, email} = response.data;
        authStore.login({ id: userId, username: this.login, email: email}, token);
        console.log(response.data);
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Ошибка подключения к серверу';
        alert(`Ошибка при авторизации: ${errorMsg}`);
      }
    },
    async registerUser() {
      if (this.registerPassword !== this.passwordConfirm) {
        alert('Пароли не совпадают');
        return;
      }

      try {
        const response = await axios.post('http://192.168.0.15:80/api/register', {
          username: this.registerLogin,
          email: this.registerEmail,
          password: this.registerPassword,
        });

        const { token, userId, email } = response.data;
        const authStore = useAuthStore();

        authStore.login({ id: userId, username: this.registerLogin, email: email }, token);

      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Ошибка подключения к серверу';
        alert(`Ошибка при регистрации: ${errorMsg}`);
      }
    },
  },
  async sendForgotPasswordRequest() {
      if (!this.forgotEmail) {
        alert('Пожалуйста, введите ваш email');
        return;
      }

      try {
        const response = await axios.post('http://192.168.0.16:80/api/forgot-password', {
          email: this.forgotEmail,
        });
        alert(`Письмо для восстановления пароля отправлено на ${this.forgotEmail}`);
        this.prevStep(); 
      } catch (error) {
        alert(`Ошибка при восстановлении пароля: ${error.response.data.message}`);
      }
    },
  mounted() {
    this.authStore = useAuthStore();
  },
};
</script>
<style lang="less">
  .form {
    &__container {
      display: flex;
      flex-direction: column;
      margin: auto;
      justify-content: center;
      align-items: center;
      padding: 25px;
      width: 200px;
      border: solid 3px @black;
    }

    &__link {
    display: block;
    text-align: center; 
    margin-top: 15px;   
    color: @black;    
    cursor: pointer;  

    &:hover {
      text-decoration: underline;
    }
  }
    &__label {
      margin-bottom: 5px;
    }

    &__group {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
    }

    &__input {
      padding: 10px;
      border: 1px solid gray;
      border-radius: 4px;
      font-size: 14px;
      color: @black;

      &:focus {
        outline: none;
      }
    }

    &__btn {
      margin-top: 10px;
      padding: 10px 20px;
      background-color: @black;
      color: @white;
      border: none;
      font-size: 16px;
      cursor: pointer;
      width: 200px;

      &:hover {
        background-color: @white;
        box-shadow: inset 0 0 0 2px black;
        color: @black;
      }

      &:active {
        background-color: @white;
        box-shadow: inset 0 0 0 2px black;
        color: @black;
      }
    }
  }

</style>
