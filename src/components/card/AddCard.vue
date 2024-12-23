<template>
  <div class="add-card">
    <div>
      <input v-model="inputCardTitle" class="form-control" type="text" />

      <button
        class="btn btn-success"
        type="submit"
        :disabled="invalidInput"
        @click="onSubmitNewCard"
      >
        Add Card
      </button>

      <a class="cancel-add-btn" href="" @click.prevent="emit('close')"
        >&times;</a
      >
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from '@/store/useStore';

const emit = defineEmits(['close']);

// Props 정의
const { pos, listId } = defineProps(['pos', 'listId']);

// Store 연결
const store = useStore();
const addCard = store.ADD_CARD;

// 상태 선언
const inputCardTitle = ref('');

// Computed: 입력값 유효성 검사
const invalidInput = computed(() => !inputCardTitle.value.trim());

// 라이프사이클 훅: 컴포넌트 마운트 시 입력란 포커스
onMounted(() => {
  const inputElement = document.querySelector('#inputCardTitle');
  if (inputElement) inputElement.focus();
});

// 카드 추가 함수
const onSubmitNewCard = () => {
  console.log('onSubmitNewCard');
  if (invalidInput.value) return;

  const title = inputCardTitle.value.trim();
  addCard({ title, pos, listId })
    .finally(() => {
      inputCardTitle.value = '';
    })
    .catch((err) => console.error(err));
};
</script>

<style>
.add-card {
  padding: 10px;
  display: block;
  position: relative;
}
.add-card .cancel-add-btn {
  display: inline-block;
  margin-left: 10px;
  vertical-align: middle;
  text-decoration: none;
  color: #888;
  font-size: 24px;
}
.add-card .cancel-add-btn:hover,
.add-card .cancel-add-btn:focus {
  color: #666;
}
</style>
