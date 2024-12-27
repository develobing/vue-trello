<template>
  <div class="list-wrapper" :data-list-id="list.id" :data-list-pos="list.pos">
    <div class="list">
      <div class="list-header">
        <input
          class="form-control input-title"
          v-if="isEditTitle"
          type="text"
          v-model="inputTitle"
          @keyup.enter="onTitleSubmit"
          @blur="onTitleSubmit"
        />

        <div v-else class="list-header-title" @click="onClickTitle">
          {{ list.title }}
        </div>

        <a class="delete-list-btn" href="" @click.prevent="onDeleteList"
          >&times;</a
        >
      </div>

      <div class="card-list" :data-list-id="list.id">
        <div v-show="!list.cards.length" class="empty-card-item"></div>
        <card-item
          v-for="card in list.cards"
          :key="`${list.id}-${card.pos}`"
          :card="card"
          :boardId="list.boardId"
        ></card-item>
      </div>

      <div v-if="isAddCard">
        <add-card
          :pos="lastCardPos"
          :listId="list.id"
          @close="isAddCard = false"
        ></add-card>
      </div>

      <a v-else class="add-card-btn" href="" @click.prevent="isAddCard = true">
        &plus; Add a card...
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useStore } from '@/composables/useStore';
import CardItem from '../card/CardItem.vue';
import AddCard from '../card/AddCard.vue';

// Props
const { list } = defineProps(['list']);

// Store 연결
const store = useStore();

// 데이터 상태
const isAddCard = ref(false);
const isEditTitle = ref(false);
const inputTitle = ref(list?.title);

// Computed: 마지막 카드 위치 계산
const lastCardPos = computed(() => {
  const lastCard = list.cards[list.cards.length - 1];
  let pos = 65535;
  if (lastCard) pos += lastCard.pos;
  return pos;
});

// Actions
const updateList = store.UPDATE_LIST;
const deleteList = store.DELETE_LIST;

// 제목 클릭 시 이벤트
const onClickTitle = () => {
  isEditTitle.value = true;
  nextTick(() => {
    const inputElement = document.querySelector('#inputTitle');
    if (inputElement) inputElement.focus();
  });
};

// 제목 수정 제출
const onTitleSubmit = () => {
  inputTitle.value = inputTitle.value.trim();
  if (!inputTitle.value) return;

  const id = list.id;
  const title = inputTitle.value;

  if (title === list.title) {
    isEditTitle.value = false;
    return;
  }

  updateList({ id, title })
    .then(() => (isEditTitle.value = false))
    .catch((err) => console.error(err));
};

// 리스트 삭제
const onDeleteList = () => {
  if (!confirm(`Delete ${list.title} list?`)) return;
  deleteList({ id: list.id }).catch((err) => console.error(err));
};
</script>

<style>
.list {
  background-color: #e2e4e6;
  border-radius: 3px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  vertical-align: top;
  width: 100%;
  max-height: 100%;
}
.list-header {
  flex: 0 0 auto;
  height: 30px;
  padding: 10px 8px 8px;
  position: relative;
}
.list-header-title {
  font-size: 16px;
  font-weight: 700;
  padding-left: 8px;
  line-height: 30px;
}
.input-title {
  width: 90%;
}
.delete-list-btn {
  position: absolute;
  right: 10px;
  top: 8px;
  text-decoration: none;
  color: #aaa;
  font-size: 24px;
}
.card-list {
  flex: 1 1 auto;
  overflow-y: scroll;
}
.empty-card-item {
  height: 10px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0);
}
.add-card-btn {
  flex: 0 0 auto;
  display: block;
  padding: 8px 10px;
  color: #8c8c8c;
  text-decoration: none;
}
.add-card-btn:focus,
.add-card-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
