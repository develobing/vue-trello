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
import 'dragula/dist/dragula.css';
import { useRoute } from 'vue-router';
import dragger from '@/utils/dragger';

// Store 연결
const store = useStore();
const route = useRoute();

// 상태 및 변수 선언
const cardDragger = ref(null);
const listDragger = ref(null);
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

// 드래그 세팅
const setDraggable = () => {
  setCardDraggable();
  setListDraggable();
};

// 카드 드래그 세팅
const setCardDraggable = () => {
  // 기존 카드 Dragger 제거
  if (cardDragger.value) cardDragger.value.destroy();

  // 카드 Dragger 초기화
  const cardContainer = document.querySelectorAll('.card-list');
  cardDragger.value = dragger.init(cardContainer);

  // 카드 Dragger 이벤트 핸들러
  cardDragger.value.on('drop', (el, wrapper) => {
    const candidates = Array.from(wrapper.querySelectorAll('.card-item'));
    const target = {
      id: Number(el.dataset.cardId),
      listId: Number(wrapper.dataset.listId),
      pos: 65535,
    };

    const { prev, next } = dragger.sibling({
      el,
      wrapper,
      candidates,
      type: 'card',
    });

    target.pos =
      prev && next
        ? (prev.pos + next.pos) / 2
        : prev
        ? prev.pos * 2
        : next.pos / 2;
    updateCard(target);
  });
};

// 리스트 드래그 세팅
const setListDraggable = () => {
  // 기존 리스트 Dragger 제거
  if (listDragger.value) listDragger.value.destroy();

  // 리스트 Dragger 초기화
  const listContainer = document.querySelectorAll('.list-section');
  listDragger.value = dragger.init(listContainer);

  // 리스트 Dragger 이벤트 핸들러
  listDragger.value.on('drop', (el, wrapper, target, siblings) => {
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
};

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

// 라이프사이클 훅
onMounted(async () => {
  await fetchData();
  inputTitle.value = board.value.title;
  setTheme(board.value.bgColor);
  setDraggable();
});

onUpdated(() => {
  setDraggable();
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
