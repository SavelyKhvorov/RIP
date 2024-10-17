<template>
  <div class="page-account">
    <div class="page-account__container">
      <h1 :style="{
        color: inputValue.length > 5 ? 'darkred' : 'darkblue',
        fontSize: inputValue.length < 2 ? '2rem' : '1.5rem'
        }"> {{ title }} </h1>
      <dIv class="page-account__form">
        <input 
          type="text"
          :placeholder="myplaceholder"
          v-model="inputValue"
          v-on:keypress.enter="addNote"
        >
      </dIv>
      <h2>inputValue: {{ inputValue }}</h2>

      <button class="btn" v-on:click="addNote">Добавить</button>
      <hr/>

      <ul class="list" v-if="notes.length !== 0">
        <li class="list-item"  v-for="(note, id) in notes">
          {{ toUpperCase(note) }}
          <button class="btn delete" v-on:click="deleteNode(id)">Удалить</button>
        </li>
        <hr/>
        <li>
          <strong> Общее количество заметок: {{ notes.length }} </strong> | Удвоенное значение: {{ doubleCountComputed }}
        </li>
      </ul>
    <div v-else>Заметок сюда добавь, я говрю, заметок в меня напиши</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Заметки",
      myplaceholder: "Сюда",
      inputValue: "",
      notes: [ "Заметка 1", "asdsad" ]
    }
  },
  methods: {
    addNote() {
      if (this.inputValue !== "") {
        this.notes.push(this.inputValue)
        this.inputValue = ""
      }
    },
    toUpperCase(item){
      return item.toUpperCase()
    },
    deleteNode(id) {
      this.notes.splice(id, 1)
    }
  },
  computed: {
    doubleCountComputed (){
      return this.notes.length * 2
    }
  },
  watch: {
    inputValue(value){
      if (value.length > 10){
        this.inputValue = ""
      }  
    }
  }
};
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
}
</style>