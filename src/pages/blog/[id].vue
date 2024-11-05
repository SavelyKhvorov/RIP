<template>
  <div class="blog-article">
    <div class="blog-article__container" ref="articleContent">
      <h2 v-if="!isEditing" class="blog-article__title">{{ editedItem.title }}</h2>
      <input v-else v-model="editedItem.title" class="blog-article__input-title" />

      <button v-if="!isEditing" class="blog-article__download-btn" @click="downloadPDF">
        <SvgDownload class="blog-article__download-icon" />
      </button>

      <button v-if="!isEditing" class="blog-article__change-btn" @click="toggleEdit">
        <SvgPencil class="blog-article__pencil-icon" />
      </button>

      <div v-if="!isEditing" class="blog-article__author">{{ editedItem.author }}</div>
      <input v-else v-model="editedItem.author" class="blog-article__input-author" />

      <div class="blog-article__sections">
        <div
          v-if="!isEditing"
          class="blog-article__sections-item"
          v-for="item in editedItem.sections"
          :key="item"
        >
          {{ item }}
        </div>
        <div v-else>
          <div
            v-for="(section, index) in editedItem.sections" 
            :key="index" 
            class="blog-article__sections-item">
            <input v-model="editedItem.sections[index]" />
          </div>
        </div>
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

export default {
  components: {
    Comments,
    SvgPencil,
    SvgDownload,
  },
  data() {
    return {
      isEditing: false,
      editedItem: {},
    };
  },
  computed: {
    id() {
      return +this.$route.params.id; 
    },
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },

    async getPost() {
      if (!this.id) return;
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${this.id}`);
        this.editedItem = {
          title: response.data.title,
          description: response.data.body,
          author: response.data.userId,
          sections: ["Секция 1", "Секция 2"],
        };
      } catch (error) {
        console.error("Ошибка при загрузке статьи:", error);
      }
    },

    async saveChanges() {
      try {
        const response = await axios.put(`https://jsonplaceholder.typicode.com/posts/${this.id}`, {
          title: this.editedItem.title,
          body: this.editedItem.description,
          userId: this.editedItem.author,
        });
        this.isEditing = false; 
      } catch (error) {
        console.error("Ошибка при сохранении статьи:", error);
        alert("Ошибка при сохранении.");
      }
    },

    cancelChanges() {
      this.getPost(); 
      this.isEditing = false;
    },

    async deleteArticle() {
      if (window.confirm("Вы уверены, что хотите удалить эту статью?")) {
        try {
          await axios.delete(`https://jsonplaceholder.typicode.com/posts/${this.id}`);
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

  &__sections {
    margin-bottom: 15px;
    display: flex;
    flex-wrap: wrap;
  }

  &__sections-item {
    margin-right: 10px;
    padding: 5px 10px;
    background-color: @white;
    border: 1px solid @black;
    border-radius: 5px;
  }

  &__text {
    line-height: 24px;
    font-size: 18px;
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
}
</style>
