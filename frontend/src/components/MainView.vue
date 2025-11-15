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
      <div class="split-layout">
        <!-- News Feed Section -->
        <div class="news-section pa-6" style="font-family: afacad; background-color: #f9f9fb">
          <h1>News Feed</h1>
          <h3  class="font-weight-light">Latest news affecting your portfolio</h3>
          <div class="news-list">
            <NewsCard v-for="item in newsItems" :key="item.id" :news="item" @click="selectNews" />
          </div>
        </div>

        <!-- Dashboard -->
        <div class="dashboard-section">
          <Dashboard />
        </div>
      </div>

      <NewsDescription :news="selectedNews" :stock-data="stockData" @close="clearSelection" />
</template>

<style scoped>

.split-layout {
  display: flex;
  gap: 2rem;
}

.news-section {
  flex: 1;
  flex-direction: column;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dashboard-section {
  flex: 1;
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