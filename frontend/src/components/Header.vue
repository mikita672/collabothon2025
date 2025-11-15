<template>
  <v-app-bar
    :elevation="0"
    color="#002e3d"
  >
    <v-container class="d-flex align-center" fluid style="max-width: 1600px;">
      <div class="d-flex align-center logo-section">
        <img src="../assets/logo.png" alt="Logo" class="header-logo" />
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center nav-section">
        <!-- User Profile Menu -->
        <v-menu location="bottom end">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="user-profile">
              <div class="user-avatar">
                <v-icon color="white" size="22">mdi-account</v-icon>
              </div>
              <div class="user-details d-none d-sm-flex">
                <span class="user-name">{{ displayName }}</span>
              </div>
              <v-icon color="#ffffff" size="18" class="ml-2">mdi-chevron-down</v-icon>
            </div>
          </template>
          
          <v-card class="profile-menu" elevation="8">
            <v-list class="py-2">
              <v-list-item @click="handleSettings" class="menu-item">
                <template v-slot:prepend>
                  <v-icon size="20" color="#475569">mdi-cog</v-icon>
                </template>
                <v-list-item-title class="menu-item-title">Settings</v-list-item-title>
              </v-list-item>
              
              <v-divider class="my-1"></v-divider>
              
              <v-list-item @click="handleLogout" class="menu-item logout-item">
                <template v-slot:prepend>
                  <v-icon size="20" color="#dc2626">mdi-logout</v-icon>
                </template>
                <v-list-item-title class="logout-title">Sign Out</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Props {
  isLoggedIn?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoggedIn: false,
});

const emit = defineEmits<{
  logout: [];
}>();

const authStore = useAuthStore()

// Display user name from store, or fallback to email or default
const displayName = computed(() => {
  if (authStore.userName) return authStore.userName
  if (authStore.userEmail) return authStore.userEmail
  return 'User'
})

const handleLogout = () => {
  emit('logout');
};

const handleProfile = () => {
  console.log('Navigate to profile');
};

const handleSettings = () => {
  console.log('Navigate to settings');
};

const handlePortfolio = () => {
  console.log('Navigate to portfolio');
};
</script>

<style scoped>
.logo-section {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.logo-section:hover {
  transform: translateY(-1px);
}

.header-logo {
  height: 50px;
  width: auto;
  object-fit: contain;
}

.logo-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(10, 61, 46, 0.15);
  transition: all 0.3s ease;
}

.logo-circle:hover {
  box-shadow: 0 6px 16px rgba(10, 61, 46, 0.2);
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  margin: 2px 0 0 0;
  letter-spacing: 0.02em;
}

/* Navigation Section */
.nav-section {
  gap: 24px;
}

/* User Profile */
.user-profile {
  display: flex;
  align-items: center;
  padding: 8px 16px 8px 8px;
  border-radius: 12px;
  background: #002e3d;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 12px;
}

.user-profile:hover {
  background: #004a5f;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0A3D2E 0%, #0d5240 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(10, 61, 46, 0.2);
}

.user-details {
  flex-direction: column;
  line-height: 1.3;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
}

.user-email {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.user-status {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

/* Profile Menu */
.profile-menu {
  border-radius: 12px !important;
  overflow: hidden;
  margin-top: 8px;
  min-width: 180px !important;
}

.menu-item {
  cursor: pointer;
  transition: background 0.2s ease;
  min-height: 44px !important;
}

.menu-item:hover {
  background: #f8fafc !important;
}

.menu-item-title {
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  color: #0f172a !important;
}

.logout-item:hover {
  background: #fef2f2 !important;
}

.logout-title {
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  color: #dc2626 !important;
}

/* Responsive */
@media (max-width: 960px) {
  .brand-name {
    font-size: 1.1rem;
  }
  
  .brand-subtitle {
    font-size: 0.7rem;
  }
}

@media (max-width: 600px) {
  .logo-circle svg {
    width: 30px;
    height: 30px;
  }
  
  .brand-info {
    margin-left: 12px !important;
  }
  
  .nav-section {
    gap: 12px;
  }
  
  .user-profile {
    padding: 6px;
  }
}
</style>
