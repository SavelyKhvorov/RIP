<template>
  <div class="page-account">
    <div class="page-account__container">
      
      <h2 class="title">Личный кабинет</h2>

      <form class="form" novalidate>
      <div class="form__container">

        <div v-show="step===1" class="step">

        <div class="form__group">
          <label class="form__label" for="login">Логин</label>
          <input v-model="login" type="text" class="form-control" id="login">
        </div>

        <div class="form__group">
            <label class="form__label" for="password">Пароль</label>
            <input v-model="passsword" type="password" class="form-control" id="password">
          </div>

        <button @click="loginUser" type="button" class="form__btn">Войти</button>
        <button @click="nextStep" type="button" class="form__btn">Ещё нет аккаунта</button>

        </div>

        <div v-show="step===2" class="step">

          <div class="form__group">
            <label class="form__label" for="login">Логин</label>
            <input v-model="registerLogin" type="text" class="form-control" id="login">
          </div>

          <div class="form__group">
              <label class="form__label" for="password">Пароль</label>
              <input v-model="registerPassword" type="password" class="form-control" id="password">
            </div>

            <div class="form__group">
              <label class="form__label" for="passwordConfirm">Подтверждение пароля</label>
              <input v-model="passwordConfirm" type="password" class="form-control" id="passwordConfirm">
            </div>

          <button @click="registerUser" type="button" class="form__btn">Зарегестрироваться</button>
          <button @click="prevStep" type="button" class="form__btn">Назад</button>
          </div>

      </div>
      </form>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      step: 1,
      login: '',
      password: '',
      registerLogin: '',
      registerPassword: '',
      passwordConfirm: ''
    }
  },
  methods:{
    nextStep() {
      this.step++
    },
    prevStep() {
      this.step--
    },
    async loginUser() {
      try {
        const response = await axios.post('https://your-api-url.com/login', {
          login: this.login,
          password: this.password
        });
        alert('Успешная авторизация:', response.data);
      } catch (error) {
        alert('Ошибка при авторизации:', error);
      }
    },
    async registerUser() {
      if (this.registerPassword !== this.passwordConfirm) {
        alert('Пароли не совпадают');
        return;
      }

      try {
        const response = await axios.post('https://your-api-url.com/register', {
          login: this.registerLogin,
          password: this.registerPassword
        });
        console.log('Успешная регистрация:', response.data);
      } catch (error) {
        console.error('Ошибка при регистрации:', error);
      }
    }
  }
}
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

  .form {

  &__container{
    display: flex;
    flex-direction: column;
    margin: auto;
    justify-content: center;
    align-items: center;
    padding: 25px;
    width: 200px;
    border: solid 3px @black;
  }  

  &__label{
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

  &__btn{
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
}

</style>