<script setup lang="ts">
import Dashboard from './dashboard/Dashboard.vue'
import NewsCard from './NewsFeed/NewsCard.vue'
import NewsDescription from './NewsFeed/NewsDescription.vue'
import { useNewsData } from '@/composables/useNewsData'
import { useNewsSelection } from '@/composables/useNewsSelection'

const { newsItems, stockData } = useNewsData()
const { selectedNews, selectNews, clearSelection } = useNewsSelection()
</script>

<template>
  <main class="main-container">
    <div class="content-wrapper">
      <div class="header-section">
        <h class="text-black-darken-1 text-bold text-2xl">Portfolio News Feed</h>
        <p class="text-grey-darken-1">Latest news affecting your AI portfolio companies</p>
      </div>

      <div class="split-layout">
        <div class="news-section">
          <NewsCard v-for="item in newsItems" :key="item.id" :news="item" @click="selectNews" />
        </div>

        <div class="dashboard-section">
          <Dashboard />
        </div>
      </div>

      <!-- Popup -->
      <NewsDescription :news="selectedNews" :stock-data="stockData" @close="clearSelection" />
    </div>
  </main>
</template>

<style scoped>
.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem 1rem;
  overflow: hidden;
}

.header-section {
  margin-bottom: 1.5rem;
  flex-shrink: 0;
}

.split-layout {
  display: flex;
  gap: 2rem;
  flex: 1;
  overflow: hidden;
}

.news-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.news-section:hover {
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.news-section::-webkit-scrollbar {
  width: 8px;
}

.news-section::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

.news-section::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.news-section:hover::-webkit-scrollbar-thumb {
  background: #cbd5e1;
}

.news-section::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dashboard-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

@media (max-width: 960px) {
  .split-layout {
    flex-direction: column;
  }

  .dashboard-section {
    display: none;
  }
}
</style>
-width: 960px) {
  .split-layout {
    flex-direction: column;
  }
  
  .empty-section {
    display: none;
  }
}
</style>