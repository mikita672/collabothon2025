<script setup lang="ts">
import { ref } from 'vue'
import Login from './components/Login.vue'
import Dashboard from './components/dashboard/Dashboard.vue'

const isLoggedIn = ref(false)

const handleLogin = () => {
  isLoggedIn.value = true
  console.log('User logged in!')
}
</script>

<template>
  <Dashboard />
</template>

<style scoped></style>
