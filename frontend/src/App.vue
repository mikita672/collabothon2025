<script setup lang="ts">
import { ref } from 'vue';
import Login from './components/Login.vue';

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
        <h1>You did it!</h1>
        <v-card class="ma-4 pa-4" max-width="300">
          Welcome to the Dashboard!
        </v-card>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped></style>
