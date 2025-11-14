<script setup lang="ts">
import MainView from './components/MainView.vue'
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
  <v-app>
    <v-main>
      <Login v-if="!isLoggedIn" @login="handleLogin" />

      <div v-else>
        <MainView />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped></style>
