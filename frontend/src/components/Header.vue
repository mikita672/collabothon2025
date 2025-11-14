<template>
  <v-app-bar
    :elevation="0"
    color="#0A3D2E"
    height="64"
    class="header-bar"
  >
    <v-container class="d-flex align-center px-4" fluid style="max-width: 100%;">
      <!-- Commerzbank Logo -->
      <div class="d-flex align-center">
        <div class="commerzbank-logo">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="2" fill="#FFCC00"/>
            <path d="M10 10L30 30M30 10L10 30" stroke="#003D5C" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="brand-text ml-3">
          <h1 class="commerzbank-title">COMMERZBANK</h1>
        </div>
      </div>

      <v-spacer></v-spacer>

      <!-- Right Side: User Menu -->
      <div class="d-flex align-center" style="gap: 16px;">
        <!-- User Menu -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              class="icon-button"
              size="small"
            >
              <v-icon color="white" size="20">mdi-account</v-icon>
            </v-btn>
          </template>
          <v-list class="user-menu" density="compact">
            <v-list-item @click="handleLogout">
              <template v-slot:prepend>
                <v-icon size="18" color="#0A3D2E">mdi-logout</v-icon>
              </template>
              <v-list-item-title class="logout-text">Sign Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useHeaderMenu } from '@/composables/useHeaderMenu';

interface Props {
  isLoggedIn?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoggedIn: false,
});

const emit = defineEmits<{
  logout: [];
}>();

const handleLogout = () => {
  emit('logout');
};

const { menuItems } = useHeaderMenu(handleLogout);
</script>

<style scoped>
.header-bar {
  border-bottom: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.commerzbank-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text {
  line-height: 1;
}

.commerzbank-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
  letter-spacing: 0.5px;
  font-family: 'Roboto', sans-serif;
}

.icon-button {
  min-width: auto !important;
  width: 40px;
  height: 40px;
  border-radius: 50% !important;
  transition: background 0.2s ease !important;
}

.icon-button:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.login-button {
  text-transform: none !important;
  color: #FFFFFF !important;
  padding: 6px 12px !important;
  min-width: auto !important;
  height: 40px !important;
  border-radius: 20px !important;
  transition: background 0.2s ease !important;
}

.login-button:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.login-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #FFFFFF;
}

.user-menu {
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 180px;
}

.logout-text {
  color: #0A3D2E;
  font-weight: 500;
}

@media (max-width: 960px) {
  .commerzbank-title {
    font-size: 0.95rem;
  }
  
  .login-text {
    display: none;
  }
}
</style>
