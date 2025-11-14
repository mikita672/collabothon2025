<script setup lang="ts">
import NewsCard from "./NewsFeed/NewsCard.vue"
import NewsDescription from "./NewsFeed/NewsDescription.vue"
import { useNewsData } from '@/composables/useNewsData'
import { useNewsSelection } from '@/composables/useNewsSelection'

// Data
const { newsItems, stockData } = useNewsData()
// Selection management
const { selectedNews, selectNews, clearSelection } = useNewsSelection()

</script>

<template>
  <main class="main-container">
    <div class="content-wrapper">
        <div class="header-section">
            <p class="text-grey-darken-1">Latest news affecting your AI portfolio companies</p>
        </div>

        <div class="split-layout">
          <div class="news-section">
            <NewsCard
              v-for="item in newsItems"
              :key="item.id"
              :news="item"
              @click="selectNews"
            />
          </div>

          <div class="empty-section">
            <!-- Empty space -->
          </div>
        </div>

        <!-- Popup -->
        <NewsDescription
          :news="selectedNews"
          :stock-data="stockData"
          @close="clearSelection"
        />
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

.empty-section {
  flex: 1;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  border: 2px dashed #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 960px) {
  .split-layout {
    flex-direction: column;
  }
  
  .empty-section {
    display: none;
  }
}
</style>