<template>
  <modal>
    <template #header>
      <div>
        <h2>
          Create new board
          <a
            href=""
            class="modal-default-button"
            @click.prevent="SET_IS_ADD_BOARD(false)"
            >&times;</a
          >
        </h2>
      </div>
    </template>

    <template #body>
      <div>
        <form id="add-board-form" @submit.prevent="onSubmitCreateBoard">
          <input class="form-control" type="text" v-model="inputBoardTitle" />
        </form>
      </div>
    </template>

    <template #footer>
      <div>
        <button
          class="btn"
          :class="{ 'btn-success': isValidInput }"
          type="submit"
          form="add-board-form"
          :disabled="!isValidInput"
        >
          Create Board
        </button>
      </div>
    </template>
  </modal>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useStore } from '@/store/useStore';
import { useRouter } from 'vue-router';
import Modal from '../common/Modal.vue';

// Store 및 Router 연결
const store = useStore();
const router = useRouter();

// 상태 및 변수 선언
const inputBoardTitle = ref('');
const isValidInput = ref(false);

// mutations 및 actions
const setIsAddBoard = store.SET_IS_ADD_BOARD;
const addBoard = store.ADD_BOARD;

// 제목 입력 변경 감시
watch(inputBoardTitle, (newVal) => {
  isValidInput.value = !!newVal.trim().length;
});

// 컴포넌트 로드 시 제목 입력에 포커스
onMounted(() => {
  const inputElement = document.querySelector('#inputBoardTitle');
  if (inputElement) inputElement.focus();
});

// 게시판 생성 제출
const onSubmitCreateBoard = () => {
  if (!inputBoardTitle.value.trim()) return;

  addBoard(inputBoardTitle.value)
    .then((id) => router.push(`/board/${id}`))
    .catch((err) => console.error(err))
    .finally(() => setIsAddBoard(false));
};
</script>
