<template>
  <div class="navbar" v-if="isLoggedIn">
    <div class="navbar-back" @click="router.back()">⬅️ Back</div>
    <router-link to="/">Home</router-link>
    <router-link to="/login" @click="store.LOGOUT()">Logout</router-link>
  </div>

  <div class="navbar" v-else>
    <router-link to="/login">Login</router-link>
  </div>
</template>

<script setup>
import { useStore } from '@/store/useStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useStore();
const isLoggedIn = computed(() => store.accessToken);
</script>

<style>
.navbar {
  display: flex;
  align-items: center;
  gap: 10px;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  margin: 0;
  background-color: #f0f0f0;
  z-index: 1000;
}
.navbar a {
  display: flex;
  align-items: center;
  background-color: #2350a8;
  color: #fff;
  text-decoration: none;
  height: 30px;
  padding: 10px;
  border-radius: 5px;
}
.navbar-back {
  display: flex;
  align-items: center;
  background-color: #2350a8;
  color: #fff;
  height: 30px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
