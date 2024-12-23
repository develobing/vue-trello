<template>
  <div class="container">
    <Navbar />

    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style>
@import './main.css';
</style>
