<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import MainView from './components/MainView.vue'
import Header from './components/Header.vue'

const authStore = useAuthStore()
const showRegister = ref(false)

const handleLogin = () => {
  showRegister.value = false
}

const handleRegister = () => {
  showRegister.value = false
}

const handleLogout = async () => {
  await authStore.logout()
  showRegister.value = false
}

const goToRegister = () => {
  showRegister.value = true
}

const goToLogin = () => {
  showRegister.value = false
}

onMounted(async () => {
  await authStore.initializeAuth()
})
</script>

<template>
  <v-app>
    <Header v-if="authStore.isLoggedIn" :is-logged-in="authStore.isLoggedIn" @logout="handleLogout" />
    
    <v-main>
      <template v-if="!authStore.isLoggedIn">
        <Register v-if="showRegister" @register="handleRegister" @go-to-login="goToLogin" />
        <Login v-else @login="handleLogin" @go-to-register="goToRegister" />
      </template>
      <MainView v-else />
    </v-main>
    
  </v-app>
</template>

<style scoped></style>
