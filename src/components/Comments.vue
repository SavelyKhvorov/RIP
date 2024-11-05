<template>
  <div class="comments">
    <div class="comments__container">
      <h3>Комментировать</h3>
      <div class="comments__wrapper">
        <div class="comments__form">
          <div class="comments__prof-pic">
            <img class="comments__prof-pic-img" src="@/assets/img/McLovin.jpeg" alt="Profile Picture">
          </div>
          <div class="comments__input-wrapper">
            <textarea v-model="inputValue" class="comments__input" placeholder="Напишите комментарий"></textarea>
            <button @click="postComment" class="comments__btn btn">Отправить</button>
          </div>
        </div>
      </div>

      <div class="comments__list">
        <div class="comments__item">
          <div class="comments__prof-pic">
            <img class="comments__prof-pic-img" src="@/assets/img/McLovin.jpeg" alt="User Picture">
          </div>
          <div class="comments__content">
            <span class="comments__username">Username</span>
            <p class="comments__text">
              Здесь будет длинный комментарий пользователя, отображающийся под его именем и аватаром. Комментарий может содержать несколько строк текста. Здесь будет длинный комментарий пользователя, отображающийся под его именем и аватаром. Комментарий может содержать несколько строк текста. Здесь будет длинный комментарий пользователя, отображающийся под его именем и аватаром. Комментарий может содержать несколько строк текста. 
            </p>
            <span class="comments__date">12/09/24</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return { 
      inputValue: '',
    };
  },
  methods:{
    postComment(){
      this.inputValue = ''
    }
  }
};

</script>

<style lang="less">
.comments {
  &__container {
    .container();
  }

  &__form {
    display: flex;
    align-items: flex-start;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 20px;
  }

  &__prof-pic {
    display: inline-block;
    border-radius: 50%;
    overflow: hidden;
    width: 50px;   
    height: 50px;  
    margin-right: 15px;
    flex-shrink: 0;
  }

  &__prof-pic-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__input-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  &__input {
    width: 98%;
    height: 80px; 
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    resize: none;
    font-size: 14px;
    margin-bottom: 10px;
  }

  &__btn {
    align-self: flex-end; 
  }

  &__list {
    margin-top: 20px;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
  }

  &__content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  &__username {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 14px;
  }

  &__text {
    margin: 0;
    color: #333;
    font-size: 14px;
    line-height: 1.5;
  }

  &__date{
    margin-top: 5px;
    font-size: 12px;
    color: #a29595;
    align-self: flex-end;
  }
}

</style>
