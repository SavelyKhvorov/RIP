<template>
  <div class="write">
    <div class="write__container">
      <h1 class="write__title">Создать пост</h1>
      <div class="write__workspace">
        <input type="text" placeholder="Заголовок" class="write__input-title" id="title">
        <div ref="editor"></div>
        <button @click="" class="write__btn btn">Отправить</button>
      </div>
    </div>
  </div>
</template>

<script>
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; 

export default {
  mounted() {
    const options = {
      theme: 'snow',
      placeholder: 'Текст мне в textarea вставь',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'image'] 
        ]
      }
    };
    const editor = new Quill(this.$refs.editor, options);
  }
}
</script>

<style lang="less">
.write {
  &__container {
    .container();
  }

  &__title {
    margin: 0 0 15px;
    color: @black;
  }

  &__workspace {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }

  &__input-title{
    padding: 10px;
    border: 1px solid #CCCCCC;
    border-radius: 4px;
    font-size: 14px;
    color: @black;
    margin-bottom: 20px;

    &:focus {
      outline: none;
    }
  }

  .ql-editor {
    min-height: 400px;
    border: gray;
  }

  &__btn{
    align-self: flex-end
  }

}
</style>
