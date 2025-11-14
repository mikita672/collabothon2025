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
      <div class="split-layout">
        <!-- News Feed Section - Left -->
        <div class="news-section">
          <div class="section-header">
            <h2 class="section-title">News Feed</h2>
            <p class="section-subtitle">Latest news affecting your portfolio</p>
          </div>
          <div class="news-list">
            <NewsCard v-for="item in newsItems" :key="item.id" :news="item" @click="selectNews" />
          </div>
        </div>

        <!-- AI Portfolio Dashboard - Right -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2 class="section-title">AI Portfolio</h2>
            <p class="section-subtitle">Performance and analytics</p>
          </div>
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
  background: #f8fafc;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem 1.5rem;
  overflow: hidden;
}

.split-layout {
  display: flex;
  gap: 2rem;
  flex: 1;
  overflow: hidden;
}

/* Section Headers */
.section-header {
  margin-bottom: 1.5rem;
  flex-shrink: 0;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

/* News Section - Left */
.news-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.news-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.news-list::-webkit-scrollbar {
  width: 8px;
}

.news-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.news-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.news-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Dashboard Section - Right */
.dashboard-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.dashboard-section::-webkit-scrollbar {
  width: 8px;
}

.dashboard-section::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.dashboard-section::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.dashboard-section::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
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