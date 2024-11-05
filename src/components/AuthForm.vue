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
      try {
        const response = await axios.post('http://26.177.53.250/api/login', {
          username: this.login,
          password: this.password,
        });
        this.authStore.login({ username: this.login, token: response.data.token });
      } catch (error) {
        alert(`Ошибка при авторизации: ${error.response.data.message}`);
      }
    },
    async registerUser() {
      if (this.registerPassword !== this.passwordConfirm) {
        alert('Пароли не совпадают');
        return;
      }

      try {
        const response = await axios.post('http://26.177.53.250/api/register', {
          username: this.registerLogin,
          email: this.registerEmail,
          password: this.registerPassword,
        });
        this.authStore.login({ username: this.registerLogin, token: response.data.token });
        alert(`Успешная регистрация: ${response.data.message}`);
      } catch (error) {
        alert(`Ошибка при регистрации: ${error.response.data.message}`);
      }
    },
  },
  async sendForgotPasswordRequest() {
      if (!this.forgotEmail) {
        alert('Пожалуйста, введите ваш email');
        return;
      }

      try {
        const response = await axios.post('http://26.177.53.250/api/forgot-password', {
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
