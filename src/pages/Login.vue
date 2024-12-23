<template>
  <div class="login">
    <h2>Log in to Trello</h2>

    <form @submit.prevent="onSubmit">
      <div>
        <label for="email">Email</label>
        <input
          class="form-control"
          type="text"
          name="email"
          v-model="email"
          autofocus
          placeholder="e.g., test@test.com"
        />
      </div>
      <div>
        <label for="password">Passwrod</label>
        <input
          class="form-control"
          type="password"
          v-model="password"
          placeholder="123123"
        />
      </div>
      <button
        class="btn"
        :class="{ 'btn-success': !invalidForm }"
        type="submit"
        :disabled="invalidForm"
      >
        Log In
      </button>
    </form>
    <p class="error" v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from '@/store/useStore';
import { useRoute, useRouter } from 'vue-router';

const store = useStore();
const route = useRoute();
const router = useRouter();

// State
const email = ref('');
const password = ref('');
const returnPath = ref(route.query.returnPath || '/');
const error = ref('');

// Computed properties
const invalidForm = computed(() => !email.value || !password.value);

// Methods
const setTheme = () => {
  store.SET_THEME();
};

const onSubmit = async () => {
  try {
    await store.LOGIN({
      email: email.value,
      password: password.value,
    });
    router.push(returnPath.value);
  } catch (err) {
    error.value = err.response?.data?.error || 'An error occurred';
  }
};

// Lifecycle hooks
setTheme();
</script>

<style>
.login {
  width: 400px;
  margin: 0 auto;
}
.error {
  color: #f00;
}
</style>
