<template>
  <div class="list add-list">
    <input
      v-if="isAddList"
      class="form-control"
      type="text"
      v-model="inputTitle"
      @keyup.enter="onSubmitTitle"
      @blur="resotre"
    />
    <a v-else @click="onClickAddList">&plus; Add another list</a>
  </div>
</template>

<script setup>
import { useStore } from '@/composables/useStore';
import { computed, nextTick, ref } from 'vue';

const store = useStore();

const board = computed(() => store.board);
const ADD_LIST = store.ADD_LIST;

const isAddList = ref(false);
const inputTitle = ref('');

const onClickAddList = () => {
  isAddList.value = true;
  nextTick(() => {
    inputTitle.value.focus();
  });
};

const onSubmitTitle = () => {
  inputTitle.value = inputTitle.value.trim();
  if (!inputTitle.value) return resotre();
  const title = inputTitle.value;
  const pos = board.value.lists[board.value.lists.length - 1].pos * 2;
  const boardId = board.value.id;
  ADD_LIST({ title, pos, boardId }).then((_) => resotre());
};

const resotre = () => {
  isAddList.value = false;
  inputTitle.value = '';
};
</script>

<style scoped>
.add-list {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 12px;
  color: #ddd;
  transition: all 0.3s;
}
.add-list:hover,
.add-list:focus {
  background-color: rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
</style>
