<template>
  <div>
    <div class="home-title">Personal Boards</div>
    <div class="board-list">
      <div
        class="board-item"
        v-for="(board, i) in boardList"
        :key="i"
        :data-bgcolor="board.bgColor"
      >
        <router-link :to="`/board/${board.id}`">
          <div class="board-item-title">{{ board.title }}</div>
        </router-link>
      </div>

      <div class="board-item">
        <a class="new-board-btn" href="" @click.prevent="onClickCreateBoard">
          Create new board...
        </a>
      </div>
    </div>

    <AddBoard v-if="isAddBoard" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated } from 'vue';
import { useStore } from '@/store/useStore';
import AddBoard from '../components/board/AddBoard.vue';

// Store 연결
const store = useStore();

// 상태 및 actions/mutations
const isAddBoard = computed(() => store.isAddBoard);
const boardList = computed(() => store.boardList);

const fetchBoardList = store.FETCH_BOARD_LIST;
const setIsAddBoard = store.SET_IS_ADD_BOARD;
const setTheme = store.SET_THEME;

// 게시판 생성 클릭 핸들러
const onClickCreateBoard = () => {
  setIsAddBoard(true);
};

// 게시판 배경 색상 설정
const updateBoardItemStyles = () => {
  Array.from(document.querySelectorAll('.board-item')).forEach((el) => {
    el.style.backgroundColor = el.dataset.bgcolor || '#ddd';
  });
};

// 라이프사이클 훅
onMounted(() => {
  fetchBoardList();
  setTheme();
});

onUpdated(() => {
  updateBoardItemStyles();
});
</script>

<style>
.home-title {
  padding: 10px;
  font-size: 18px;
  font-weight: bold;
}
.board-list {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
}
.board-item {
  width: 23%;
  height: 100px;
  margin: 0 2% 20px 0;
  border-radius: 3px;
}
.board-item a {
  text-decoration: none;
  display: block;
  width: 100%;
  height: 100%;
}
.board-item a:hover,
.board-item a:focus {
  background-color: rgba(0, 0, 0, 0.1);
  color: #666;
}
.board-item-title {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  padding: 10px;
}
.board-item a.new-board-btn {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  height: 100px;
  width: inherit;
  color: #888;
  font-weight: 700;
}
</style>
