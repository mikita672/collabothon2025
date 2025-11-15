<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import { usePortfolioStore } from './stores/portfolio'
import { PortfolioService } from './services/portfolio'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import MainView from './components/MainView.vue'
import Header from './components/Header.vue'

const authStore = useAuthStore()
const portfolioStore = usePortfolioStore()
const showRegister = ref(false)

const handleLogin = () => {
  showRegister.value = false
}

const handleRegister = () => {
  showRegister.value = false
}

const handleLogout = async () => {
  portfolioStore.unsubscribeFromPortfolio()
  await authStore.logout()
  showRegister.value = false
}

const goToRegister = () => {
  showRegister.value = true
}

const goToLogin = () => {
  showRegister.value = false
}

// Initialize portfolio when user logs in
watch(() => authStore.isLoggedIn, async (isLoggedIn) => {
  if (isLoggedIn && authStore.userId) {
    // Check if portfolio exists, if not create it
    const portfolioData = await PortfolioService.getUserPortfolioData(authStore.userId)
    
    if (!portfolioData) {
      await PortfolioService.createUserPortfolio(
        authStore.userId,
        authStore.userEmail,
        authStore.userName
      )
    } else {
      // Migrate existing portfolio to add stocks array if missing
      await PortfolioService.migrateUserPortfolio(authStore.userId)
    }
    
    // Subscribe to portfolio updates
    portfolioStore.subscribeToPortfolio()
  }
})

onMounted(async () => {
  await authStore.initializeAuth()
  
  // If already logged in, initialize portfolio
  if (authStore.isLoggedIn && authStore.userId) {
    const portfolioData = await PortfolioService.getUserPortfolioData(authStore.userId)
    
    if (!portfolioData) {
      await PortfolioService.createUserPortfolio(
        authStore.userId,
        authStore.userEmail,
        authStore.userName
      )
    } else {
      // Migrate existing portfolio to add stocks array if missing
      await PortfolioService.migrateUserPortfolio(authStore.userId)
    }
    
    portfolioStore.subscribeToPortfolio()
  }
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
