<script setup lang="ts">
import { BarChart3, Newspaper } from "lucide-vue-next";
import { ref } from 'vue'

const activeTab = ref("dashboard")

</script>

<template>
  <main class="main-container">
    <div class="content-wrapper">
        <!-- button switches -->
        <div class="flex gap-4 border-b mb-6">
            <v-card class="tab-card mb-6" elevation="0">
                <v-tabs
                    v-model="activeTab"
                    color="primary"
                    align-tabs="start"
                >
                    <v-tab value="dashboard" class="text-none">
                        <v-icon class="mr-2" size="20">mdi-view-dashboard</v-icon>
                        Dashboard
                    </v-tab>

                    <v-tab value="news" class="text-none">
                        <v-icon class="mr-2" size="20">mdi-newspaper</v-icon>
                        News Feed
                    </v-tab>
                </v-tabs>
            </v-card>
        </div>

        <!--tabs content-->
        <v-window v-model="activeTab">
            <v-window-item value="dashboard">
            <div class="pa-4">
                <h2 class="text-h5 mb-4">Dashboard</h2>
                <p class="text-grey-darken-1">Dashboard content goes here...</p>
            </div>
            </v-window-item>

            <v-window-item value="news">
            <div class="pa-4">
                <h2 class="text-h5 mb-4">News Feed</h2>
                <p class="text-grey-darken-1">News feed content goes here...</p>
                
            </div>
            </v-window-item>
        </v-window>
    </div>
  </main>
</template>

<style scoped>
.main-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.content-wrapper {
  width: 100%;
}

.tab-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}


</style>