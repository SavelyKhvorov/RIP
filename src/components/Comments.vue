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
        <div v-for="comment in comments" :key="comment.id" class="comments__item">
          <div class="comments__prof-pic">
            <img class="comments__prof-pic-img" :src="comment.avatarUrl || '@/assets/img/default-avatar.png'" alt="User Picture">
          </div>
          <div class="comments__content">
            <span class="comments__username">{{ comment.username }}</span>
            <p class="comments__text">{{ comment.text }}</p>
            <span class="comments__date">{{ comment.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

// export default {
//   data() {
//     return {
//       inputValue: '',
//       comments: [], // массив для хранения комментариев
//       socket: null, // ссылка на объект сокета
//     };
//   },
//   mounted() {
//     // Подключаемся к серверу веб-сокетов при монтировании компонента
//     this.socket = io('http://localhost:3000'); // Замените на URL вашего сервера

//     // Слушаем событие получения нового комментария
//     this.socket.on('newComment', (comment) => {
//       this.comments.push(comment); // добавляем новый комментарий в список
//     });

//     // Запрос всех комментариев при загрузке страницы
//     this.socket.emit('getComments'); // Запрос всех комментариев с сервера
//     this.socket.on('allComments', (comments) => {
//       this.comments = comments; // Инициализация списка комментариев
//     });
//   },
//   methods: {
//     postComment() {
//       if (!this.inputValue.trim()) return; // проверка на пустой комментарий

//       const newComment = {
//         text: this.inputValue,
//         username: 'User1', // замените на реальное имя пользователя
//         avatarUrl: '@/assets/img/McLovin.jpeg', // можно также заменить на URL из данных пользователя
//         date: new Date().toLocaleDateString(),
//       };

//       // Отправляем комментарий на сервер
//       this.socket.emit('postComment', newComment);

//       // Очистить поле ввода
//       this.inputValue = '';
//     },
//   },
//   beforeDestroy() {
//     // Отключаемся от сокета при уничтожении компонента
//     if (this.socket) {
//       this.socket.disconnect();
//     }
//   },
// };
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
