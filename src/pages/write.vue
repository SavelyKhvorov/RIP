<template>
  <div class="write">
    <div class="write__container">
      <h1 class="write__title">Создать пост</h1>
      <div class="write__workspace">
        <input type="text" placeholder="Заголовок" class="write__input-title" v-model="title">

        <div class="tags-container">
          <div v-for="(tag, index) in tags" :key="index" class="tag-input-container">
            <input 
              type="text" 
              placeholder="Тег" 
              class="write__input-tag" 
              v-model="tags[index]" 
            />
            <button @click="removeTag(index)" v-if="tags.length > 1" class="remove-btn">-</button>
          </div>

          <div>
            <button @click="addTag" class="write__add-btn btn">Ещё тег</button>
            <button @click="selectImage" class="write__addImg-btn btn">Добавить изображение</button>
            <input type="file" ref="imageInput" class="write__imgInput" style="display: none;" @change="uploadImage"/>
          </div>

        </div>

        <div ref="editor"></div>

        <button @click="submitPost" class="write__btn btn">Отправить</button>
      </div>
    </div>
  </div>
</template>

<script>
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

export default {
  data() {
    return {
      title: '',
      tags: [''],
      category_id: null,
      user_id: null,
      quillEditor: null,
      imageUrl: '', 
    };
  },
  computed: {
    isAuthenticated() {
      const authStore = useAuthStore();
      return authStore.isAuthenticated;
    },
  },
  mounted() {
    const editorElement = this.$refs.editor;
    if (!editorElement) {
      console.error('Quill редактор не найден!');
      return;
    }

    const authStore = useAuthStore();
    authStore.checkAuth();

    const options = {
      theme: 'snow',
      placeholder: 'Текст мне в textarea вставь',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'image'],
        ],
      },
    };
    this.quillEditor = new Quill(this.$refs.editor, options); 
  },
  methods: {
    selectImage() {
      this.$refs.imageInput.click();
    },
    addTag() {
      this.tags.push('');
    },
    removeTag(index) {
      if (this.tags.length > 1) {
        this.tags.splice(index, 1);
      }
    },
    async uploadImage(event) {
      const authStore = useAuthStore();
      const token = authStore.token;
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('article_image', file); 

      try {
        const response = await axios.post('http://192.168.0.15:80/api/articles/upload_image', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data && response.data.image_url) {
          this.imageUrl = response.data.image_url; 
          alert('Изображение успешно загружено');
        }
      } catch (error) {
        console.error('Ошибка при загрузке изображения:', error);
        alert('Не удалось загрузить изображение');
      }
    },
    submitPost() {
      if (window.confirm("Вы уверены, что хотите отправить эту статью?")) {
        const content = this.quillEditor ? this.quillEditor.root.innerText : '';

        if (!this.title.trim() || !content.trim()) {
          alert('Заполните заголовок и содержимое статьи!');
          return;
        }

        const postData = {
          title: this.title,
          content: content,
          tags: this.tags.filter(tag => tag.trim() !== ""),
          category_id: this.category_id,
          image_url: this.imageUrl, // Передаем URL картинки
        };

        const authStore = useAuthStore();
        const token = authStore.token;
        if (!token) {
          alert("Необходима авторизация");
          return;
        }

        axios.post('http://192.168.0.15:80/api/articles', postData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          alert('Статья успешно отправлена!');
          this.title = '';                
          this.tags = [''];               
          this.quillEditor.setText('');
          this.imageUrl = ''; 
        })
      }
    }
  }
};
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

  &__input-title {
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

  .tags-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .tag-input-container {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  &__input-tag {
    padding: 10px;
    border: 1px solid #CCCCCC;
    border-radius: 4px;
    font-size: 14px;
    color: @black;
    width: 180px;

    &:focus {
      outline: none;
    }
  }

  .write__btn {
    align-self: flex-end;
  }

  .ql-editor {
    min-height: 300px;
    border: gray;
  }

  .remove-btn {
    background-color: @black;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
  }

  &__addImg-btn{
    width: 260px;
    margin-left: 10px;
  }


}
</style>
