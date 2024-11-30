<template>
  <div class="blog-article">
    <div class="blog-article__container" ref="articleContent">
      <h2 v-if="!isEditing" class="blog-article__title">{{ editedItem.title }}</h2>
      <input v-else v-model="editedItem.title" class="blog-article__input-title" />

      <button v-if="!isEditing" class="blog-article__download-btn" @click="downloadPDF">
        <SvgDownload class="blog-article__download-icon" />
      </button>

      <button v-if="!isEditing && (currentUserId === editedItem.userId)"  class="blog-article__change-btn" @click="toggleEdit">
        <SvgPencil class="blog-article__pencil-icon" />
      </button>

      <div class="blog-article__author">{{ editedItem.author }}</div>


      <div  class="blog-article__tags">
        <div
          v-if="!isEditing"
          class="blog-article__tags-item"
          v-for="tag in editedItem.tags"
          :key="tag"
        >
          {{ tag }}
        </div>
        <div v-else>
          <div
            v-for="(tag, index) in editedItem.tags" 
            :key="index" 
            class="blog-article__tag-input-container">
            <input v-model="editedItem.tags[index]" class="blog-article__input-tag"/>
            <button @click="removeTag(index)" v-if="editedItem.tags.length > 1" class="remove-btn">-</button>
          </div>
          <button @click="addTag" class="write__add-btn btn">Добавить тег</button>
        </div>
      </div>

      
    <div class="blog-article__image-container" v-if="editedItem.picture">
      <img :src="editedItem.picture" alt="Article Image" class="blog-article__image" />
    </div>

    <div v-if="isEditing" class="blog-article__image-edit">
      <label for="imageUpload" class="blog-article__upload-label">Загрузить изображение</label>
      <input type="file" id="imageUpload" accept="image/*" @change="changeImage" class="blog-article__upload-input" />
      <button v-if="editedItem.picture" @click="deleteImage" class="blog-article__delete-image-btn">Удалить изображение</button>
    </div>


      <p v-if="!isEditing" class="blog-article__text">{{ editedItem.description }}</p>
      <textarea v-else v-model="editedItem.description" class="blog-article__input-description"></textarea>

      <div v-if="isEditing" class="blog-article__edit-buttons">
        <button @click="saveChanges">Сохранить</button>
        <button @click="cancelChanges">Отменить</button>
        <button @click="deleteArticle">Удалить</button>
      </div>

      <div>
        <Comments/>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";
import SvgPencil from "@/components/icons/SvgPencil.vue";
import SvgDownload from "@/components/icons/SvgDownload.vue";
import Comments from "@/components/Comments.vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useAuthStore } from '@/store/auth';


export default {
  components: {
    Comments,
    SvgPencil,
    SvgDownload,
  },
  data() {
    const authStore = useAuthStore();
    return {
      isEditing: false,
      editedItem: {},
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    currentUserId() {
      const authStore = useAuthStore();
      return authStore.user?.id || null; 
    },
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    async getPost() { 
      if (!this.id) return;
      try {
        const response = await axios.get(`http://192.168.0.15:80/api/articles/${this.id}`);
        this.editedItem = {
          title: response.data.title,
          description: response.data.description,
          userId: response.data.user_id,
          author: response.data.author,
          tags: response.data.tags || [], 
          picture: response.data.picture,
        };
        console.log(response.data.id);
        console.log("currentUserId в getPost:", this.currentUserId);
        console.log("edititem.userid:", this.editedItem.userId);
      } catch (error) {
        console.error("Ошибка при загрузке статьи:", error);
      }
    },

    addTag() {
      this.editedItem.tags.push('');
    },

    removeTag(index) {
      if (this.editedItem.tags.length > 1) {
        this.editedItem.tags.splice(index, 1);
      }
    },

    async saveChanges() {
      const authStore = useAuthStore();
      const token = authStore.token;
      console.log("Token:", token);

        try {
            await axios.put(`http://192.168.0.15:80/api/articles/${this.id}`, {
                title: this.editedItem.title,
                description: this.editedItem.description,
                userId: this.editedItem.author,
                tags: this.editedItem.tags.filter(tag => tag.trim() !== ""),
                picture: this.editedItem.picture,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            this.isEditing = false; 
        } catch (error) {
            console.error("Ошибка при сохранении статьи:", error);
            alert("Ошибка при сохранении.");
        }
    },


  async changeImage(event) {
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
          this.editedItem.picture = response.data.image_url; 
          alert('Изображение успешно загружено');
        }
      } catch (error) {
        console.error('Ошибка при загрузке изображения:', error);
        alert('Не удалось загрузить изображение');
      }
    },

    async deleteImage() {
      const authStore = useAuthStore();
      const token = authStore.token;

      try {
        await axios.delete(`http://192.168.0.15:80/api/articles/${this.id}/image`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.editedItem.picture = null; 
        alert("Изображение успешно удалено.");
      } catch (error) {
        console.error("Ошибка при удалении изображения:", error);
        alert("Ошибка при удалении изображения.");
      }
    },

    cancelChanges() {
      this.getPost();
      this.isEditing = false;
    },

    async deleteArticle() {
      const authStore = useAuthStore();
      const token = authStore.token;
      console.log("Token:", token);
    if (window.confirm("Вы уверены, что хотите удалить эту статью?")) {
        try {
            await axios.delete(`http://192.168.0.15:80/api/articles/${this.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            alert("Статья успешно удалена.");
            this.$router.push('/');
        } catch (error) {
            console.error("Ошибка при удалении статьи:", error);
            alert("Ошибка при удалении.");
        }
    }
},

    async downloadPDF() {
      const element = this.$refs.articleContent;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pdfHeight = (imgHeight * pageWidth) / imgWidth;

      if (pdfHeight <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
      } else {
        let position = 0;
        while (position < imgHeight) {
          if (position !== 0) {
            pdf.addPage();
          }
          const remainingHeight = imgHeight - position;
          const heightToDraw = remainingHeight < pageHeight ? remainingHeight : pageHeight;
          pdf.addImage(imgData, "PNG", 0, -position * (pageWidth / imgWidth), pageWidth, pageHeight);
          position += pageHeight;
        }
      }
      pdf.save(`${this.editedItem.title}.pdf`);
    },
  },
  created() {
    const authStore = useAuthStore();
    authStore.checkAuth();
    if (authStore.user) {
      this.currentUserId = authStore.user.id; 
    }
    console.log("Текущий currentUserId:", this.currentUserId);
    this.getPost();
  },
};
</script>

<style lang="less">
.blog-article {
  &__container {
    .container();
    position: relative;
  }

  &__title {
    margin: 0 0 10px;
    color: @black;
  }

  &__author {
    margin-bottom: 10px;
    text-decoration: underline;
    font-size: 14px;
  }

    &__tags {
    margin-bottom: 15px;
    display: flex;
    flex-wrap: wrap;
  }

  &__tags-item {
    margin-right: 10px;
    padding: 5px 10px;
    background-color: @white;
    border: 1px solid @black;
    border-radius: 5px;
  }

  &__text {
    line-height: 24px;
    font-size: 18px;
    word-wrap: break-word;       
    overflow-wrap: break-word; 
    white-space: normal;         
    max-width: 100%; 
  }

  &__change-btn {
    position: absolute;
    top: 0;
    right: 10px;
  }

  &__download-btn {
    position: absolute;
    top: 0;
    right: 60px;
  }

  &__pencil-icon,
  &__download-icon {
    color: @black;
    width: 30px;
    height: 30px;
  }

  &__input-title,
  &__input-author,
  &__input-description {
    width: 100%;
    margin-bottom: 10px;
  }

  &__edit-buttons {
    margin-top: 10px;
    display: flex;
    gap: 10px;
  }

  &__image-container {
    margin-bottom: 15px;
    text-align: center;
  }

  &__image {
    max-width: 300px;
    max-height: 300px;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  &__upload-label {
    display: inline-block;
    padding: 5px 10px;
    background-color: @black;
    color: @white;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 10px;
  }

  &__upload-input {
    display: none; 
  }

  &__delete-image-btn {
    margin-top: 10px;
    margin-left: 10px;
    padding: 5px 10px;
    background-color: @black;
    color: @white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
}

.remove-btn {
    margin-left: 5px;
    background-color: @black;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
  }

  .write__add-btn {
    padding: 5px 10px;
    background-color: @black;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }



</style>
