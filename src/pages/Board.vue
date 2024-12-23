<template>
  <div>
    <div class="board-wrapper">
      <div class="board">
        <div class="board-header">
          <input
            v-if="isEditTitle"
            ref="inputTitleRef"
            type="text"
            class="form-control"
            v-model="inputTitle"
            @keyup.enter="onTitleSubmit"
            @blur="onTitleSubmit"
          />
          <span
            v-else
            @click="onClickTitle"
            class="board-header-btn board-title"
            >{{ board.title }}</span
          >
          <a
            class="board-header-btn show-menu"
            href=""
            @click.prevent="onClickShowMenu"
            >... Show Menu</a
          >
        </div>

        <div class="list-section-wrapper">
          <div class="list-section">
            <List
              v-for="list in board.lists"
              :key="list.pos"
              :list="list"
            ></List>

            <div class="list-wrapper">
              <!-- <add-list /> -->
            </div>
          </div>
        </div>

        <!-- <board-settings v-if="isShowBoardMenu" /> -->
        <router-view :boardId="board.id"></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '@/store/useStore';
import { computed, nextTick, onMounted, onUpdated, ref, watch } from 'vue';
import List from '../components/board/List.vue';
// import AddList from "./AddList.vue";
// import BoardSettings from "./BoardSettings.vue";
import dragula from 'dragula';
import 'dragula/dist/dragula.css';
import { useRoute } from 'vue-router';

// Store 연결
const store = useStore();
const route = useRoute();

// 상태 및 변수 선언
const drakeList = ref(null);
const drake = ref(null);
const isEditTitle = ref(false);
const inputTitle = ref('');
const inputTitleRef = ref(null);

// 상태 및 actions/mutations
const board = computed(() => store.board);
const isShowBoardMenu = computed(() => store.isShowBoardMenu);

const fetchBoard = store.FETCH_BOARD;
const updateBoard = store.UPDATE_BOARD;
const updateCard = store.UPDATE_CARD;
const updateList = store.UPDATE_LIST;
const setIsShowBoardMenu = store.SET_IS_SHOW_BOARD_MENU;
const setTheme = store.SET_THEME;

// 데이터 fetch 함수
const fetchData = async () => {
  await fetchBoard(route.params.id);
};

// 제목 클릭 이벤트
const onClickTitle = () => {
  isEditTitle.value = true;
  nextTick(() => {
    inputTitle.value = board.value.title;
    inputTitleRef.value.focus();
  });
};

// 제목 수정 이벤트
const onTitleSubmit = async () => {
  inputTitle.value = inputTitle.value.trim();
  if (!inputTitle.value || inputTitle.value === board.value.title) {
    isEditTitle.value = false;
    return;
  }
  await updateBoard({ id: board.value.id, title: inputTitle.value });
  isEditTitle.value = false;
};

// 메뉴 표시 이벤트
const onClickShowMenu = () => {
  setIsShowBoardMenu(true);
};

// dragula 초기화
const initDragula = () => {
  if (drakeList.value) drakeList.value.destroy();
  if (drake.value) drake.value.destroy();

  drakeList.value = dragula([...document.querySelectorAll('.list-section')], {
    invalid: (el, handle) => !/^list/.test(handle.className),
  }).on('drop', (el, wrapper, target, siblings) => {
    const targetList = { id: Number(el.dataset.listId), pos: 65535 };
    let prevList = null;
    let nextList = null;

    const lists = Array.from(wrapper.querySelectorAll('.list-wrapper'));

    lists.forEach((list, idx) => {
      if (list === el) {
        prevList =
          idx > 0
            ? {
                id: Number(lists[idx - 1].dataset.listId),
                pos: Number(lists[idx - 1].dataset.listPos),
              }
            : null;
        nextList =
          idx < lists.length - 1
            ? {
                id: Number(lists[idx + 1].dataset.listId),
                pos: Number(lists[idx + 1].dataset.listPos),
              }
            : null;
      }
    });
    targetList.pos =
      prevList && nextList
        ? (prevList?.pos + nextList?.pos) / 2
        : prevList
        ? prevList?.pos * 2
        : nextList?.pos / 2;
    updateList(targetList);
  });

  drake.value = dragula([...document.querySelectorAll('.card-list')]).on(
    'drop',
    (el, wrapper) => {
      const targetCard = {
        id: Number(el.dataset.cardId),
        listId: Number(wrapper.dataset.listId),
        pos: 65535,
      };
      let prevCard = null;
      let nextCard = null;

      const cards = Array.from(wrapper.querySelectorAll('.card-item'));
      cards.forEach((card, idx) => {
        if (card === el) {
          prevCard =
            idx > 0
              ? {
                  id: Number(cards[idx - 1].dataset.cardId),
                  pos: Number(cards[idx - 1].dataset.cardPos),
                }
              : null;
          nextCard =
            idx < cards.length - 1
              ? {
                  id: Number(cards[idx + 1].dataset.cardId),
                  pos: Number(cards[idx + 1].dataset.cardPos),
                }
              : null;
        }
      });

      targetCard.pos =
        prevCard && nextCard
          ? (prevCard.pos + nextCard.pos) / 2
          : prevCard
          ? prevCard.pos * 2
          : nextCard.pos / 2;
      updateCard(targetCard);
    }
  );
};

// 라이프사이클 훅
onMounted(async () => {
  await fetchData();
  inputTitle.value = board.value.title;
  setTheme(board.value.bgColor);
  initDragula();
});

onUpdated(() => {
  initDragula();
});

watch(() => route, fetchData);
</script>

<style>
.board-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
.board {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.board-header {
  flex: none;
  padding: 8px 4px 8px 8px;
  margin: 0;
  margin-bottom: 15px;
  height: 32px;
  line-height: 32px;
}
.board-header input[type='text'] {
  width: 200px;
}
.board-header-btn {
  border-radius: 4px;
  padding: 2px 10px;
  height: 30px;
  margin-bottom: 15px;
  display: inline-block;
  color: #fff;
}
.board-header-btn:hover,
.board-header-btn:focus {
  background-color: rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
.board-title {
  font-weight: 700;
  font-size: 18px;
}
.show-menu {
  font-size: 14px;
  position: absolute;
  right: 15px;
}

.list-section-wrapper {
  flex-grow: 1;
  position: relative;
}
.list-section {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 0 10px;
}
.list-wrapper {
  display: inline-block;
  height: 100%;
  width: 272px;
  vertical-align: top;
  margin-right: 5px;
}

.card-item.gu-transit {
  background-color: #555 !important;
}
.card-item.gu-mirror {
  opacity: 1 !important;
  background-color: #fff !important;
  transform: rotate(3deg) !important;
}
/* .list-wrapper.gu-transit .list {
  background-color: #555 !important;
  color: #555 !important;
  opacity: 1 !important;
}
.list-wrapper.gu-mirror .list {
  opacity: 1 !important;
  background-color: #fff !important;
  transform: rotate(3deg) !important;
} */
</style>
