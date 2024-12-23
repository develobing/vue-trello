<template>
  <Modal class="modal-card" @close="onClickClose">
    <template #header>
      <div class="modal-card-header">
        <div class="modal-card-header-title">
          <input
            ref="inputTitleRef"
            class="form-control"
            type="text"
            :readonly="!toggleTitle"
            v-model="inputTitle"
            @click.prevent="toggleTitle = !toggleTitle"
            @blur="onBlurTitle"
          />
        </div>
        <a class="modal-close-btn" href="" @click.prevent="onClickClose"
          >&times;</a
        >
      </div>
    </template>

    <template #body>
      <div>
        <h3>Description</h3>
        <textarea
          ref="inputDescRef"
          class="form-control"
          cols="30"
          rows="3"
          placeholder="Add a more detailed description..."
          :readonly="!toggleDesc"
          v-model="inputDesc"
          @click.prevent="toggleDesc = !toggleDesc"
          @blur="onBlurInputDesc"
        ></textarea>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from '@/store/useStore';
import { useRouter, useRoute } from 'vue-router';
import Modal from '@/components/common/Modal.vue';

// Props
const { boardId } = defineProps(['boardId']);

// Store 및 Router 연결
const store = useStore();
const router = useRouter();
const route = useRoute();

// 상태 선언
const inputTitle = ref(store.card.title);
const inputDesc = ref(store.card.description);
const toggleTitle = ref(false);
const toggleDesc = ref(false);

//  상태 및 actions
const card = computed(() => store.card);
const fetchCard = store.FETCH_CARD;
const updateCard = store.UPDATE_CARD;

// 카드 데이터 불러오기
onMounted(async () => {
  await fetchCard(route.params.cid).catch((err) => console.error(err));
  inputTitle.value = card.value.title;
  inputDesc.value = card.value.description;
});

// 모달 닫기
const onClickClose = () => {
  router.push(`/board/${boardId}`);
};

// 제목 업데이트
const onBlurTitle = async () => {
  toggleTitle.value = !toggleTitle.value;
  const title = inputTitle.value.trim();
  if (!title) return;
  await updateCard({ id: card.value.id, title }).catch((err) =>
    console.error(err)
  );
};

// 설명 업데이트
const onBlurInputDesc = async () => {
  toggleDesc.value = !toggleDesc.value;
  const description = inputDesc.value.trim();
  if (!description) return;
  await updateCard({ id: card.value.id, description }).catch((err) =>
    console.error(err)
  );
};
</script>

<style>
.modal-card .modal-container {
  min-width: 300px;
  max-width: 800px;
  width: 60%;
}
.modal-card-header-title {
  padding-right: 30px;
}
.modal-close-btn {
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 24px;
  text-decoration: none;
}
.modal-card-header {
  position: relative;
}
</style>
