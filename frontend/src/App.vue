<script setup lang="ts">
import { ref } from 'vue';
import Login from './components/Login.vue';
import MainView from './components/MainView.vue'

const isLoggedIn = ref(false);

const handleLogin = () => {
  isLoggedIn.value = true;
  console.log('User logged in!');
};
</script>

<template>
  <v-app>
    <v-main>
      <Login v-if="!isLoggedIn" @login="handleLogin" />
      
      <div v-else>
        <MainView/>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped></style>
