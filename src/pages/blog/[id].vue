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
    </div>
  </div>
</template>

<script>
import newsList from "@/json/news.json";
import SvgPencil from "@/components/icons/SvgPencil.vue";
import SvgDownload from "@/components/icons/SvgDownload.vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default {
  components: {
    SvgPencil,
    SvgDownload,
  },
  data() {
    return {
      newsList: newsList, 
      isEditing: false,
      editedItem: {},
    };
  },
  computed: {
    listItem() {
      return (
        this.newsList.find((item) => this.$route.params.id == item.id) || {}
      );
    },
  },
  watch: {
    listItem: {
      immediate: true,
      handler(newItem) {
        this.editedItem = { ...newItem };
      },
    },
  },
  methods: {
    toggleEdit() {
      if (!this.isEditing) {
        this.editedItem = { ...this.listItem }; 
      }
      this.isEditing = !this.isEditing;
    },
    saveChanges() {
      const index = this.newsList.findIndex((item) => item.id === this.editedItem.id);
      if (index !== -1) {
        this.newsList[index] = { ...this.editedItem };
      }
      this.isEditing = false; 
    },
    cancelChanges() {
      this.editedItem = { ...this.listItem }; 
      this.isEditing = false; 
    },
    deleteArticle() {
      if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
        const index = this.newsList.findIndex((item) => item.id === this.editedItem.id);
        if (index !== -1) {
          this.newsList.splice(index, 1);
        }
        this.$router.push('/');
      }
    },
    async downloadPDF() {
      const element = this.$refs.articleContent;

      // Захватываем изображение с элемента через html2canvas
      const canvas = await html2canvas(element, {
        scale: 2,  // Масштабируем для повышения качества
        useCORS: true  // Поддержка CORS (если требуется)
      });

      // Получаем размеры canvas
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Получаем изображение в формате PNG
      const imgData = canvas.toDataURL('image/png');

      // Создаем новый PDF-документ в формате A4
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Рассчитываем высоту изображения в пропорции к ширине PDF-страницы
      const pdfHeight = (imgHeight * pageWidth) / imgWidth;

      // Если изображение не превышает высоту страницы, просто добавляем его на одну страницу
      if (pdfHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pdfHeight);
      } else {
        // Если изображение больше одной страницы, делаем многостраничный PDF
        let position = 0;
        while (position < imgHeight) {
          // Если это не первая страница, добавляем новую страницу
          if (position !== 0) {
            pdf.addPage();
          }

          // Рисуем изображение на странице с соответствующим смещением
          const remainingHeight = imgHeight - position; // Оставшаяся высота изображения
          const heightToDraw = remainingHeight < imgHeight ? remainingHeight : pageHeight;

          pdf.addImage(
            imgData, 'PNG',
            0, -position * (pageWidth / imgWidth), // Сдвиг по высоте в зависимости от позиции
            pageWidth, pageHeight
          );

          position += pageHeight;
        }
      }

      // Сохраняем PDF
      pdf.save(`${this.editedItem.title}.pdf`);
    }
  }
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
