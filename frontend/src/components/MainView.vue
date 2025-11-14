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
        <div class="news-section pa-6" style=" background-color: #f9f9fb">
          <h1 style="font-family: afacad">News Feed</h1>
          <h3 style="font-family: afacad" class="font-weight-light">Latest news affecting your portfolio</h3>
          <div class="news-list">
            <NewsCard v-for="item in newsItems" :key="item.id" :news="item" @click="selectNews" />
          </div>
        </div>

        <!-- AI Portfolio Dashboard - Right -->
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem 1.5rem;
}

.split-layout {
  display: flex;
  gap: 2rem;
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
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 0.5rem;
}

/* Dashboard Section - Right */
.dashboard-section {
  flex: 1;
  display: flex;
  flex-direction: column;
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