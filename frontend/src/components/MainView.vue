<script setup lang="ts">
import { ref } from 'vue'
import NewsCard from "./NewsFeed/NewsCard.vue"
import NewsDescription from "./NewsFeed/NewsDescription.vue"

const selectedNews = ref<any>(null)

const newsItems = ref([
  {
    id: '1',
    title: 'Apple announces new AI chip for iPhone',
    ticker: 'AAPL',
    sentiment: 'positive' as const,
    priceImpact: 2.5,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    company: 'Apple Inc.',
    summary: 'Apple has announced a breakthrough AI chip that will power next-generation iPhones, promising 40% better performance.',
    sourceUrl: 'https://example.com/apple-ai-chip',
    educationalNote: 'Hardware innovations in AI processing can significantly impact a company\'s competitive position and stock value.'
  },
  {
    id: '2',
    title: 'Tesla faces production delays in new facility',
    ticker: 'TSLA',
    sentiment: 'negative' as const,
    priceImpact: -1.8,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    company: 'Tesla Inc.',
    summary: 'Tesla reports delays in ramping up production at its new manufacturing facility, affecting delivery targets.',
    sourceUrl: 'https://example.com/tesla-delays',
    educationalNote: 'Production delays can affect quarterly earnings and investor confidence, often leading to short-term stock volatility.'
  },
  {
    id: '3',
    title: 'Apple announces new AI chip for iPhone',
    ticker: 'AAPL',
    sentiment: 'positive' as const,
    priceImpact: 2.5,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    company: 'Apple Inc.',
    summary: 'Apple has announced a breakthrough AI chip that will power next-generation iPhones, promising 40% better performance.',
    sourceUrl: 'https://example.com/apple-ai-chip',
    educationalNote: 'Hardware innovations in AI processing can significantly impact a company\'s competitive position and stock value.'
  },
  {
    id: '4',
    title: 'Apple announces new AI chip for iPhone',
    ticker: 'AAPL',
    sentiment: 'positive' as const,
    priceImpact: 2.5,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    company: 'Apple Inc.',
    summary: 'Apple has announced a breakthrough AI chip that will power next-generation iPhones, promising 40% better performance.',
    sourceUrl: 'https://example.com/apple-ai-chip',
    educationalNote: 'Hardware innovations in AI processing can significantly impact a company\'s competitive position and stock value.'
  },
  {
    id: '5',
    title: 'Apple announces new AI chip for iPhone',
    ticker: 'AAPL',
    sentiment: 'positive' as const,
    priceImpact: 2.5,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    company: 'Apple Inc.',
    summary: 'Apple has announced a breakthrough AI chip that will power next-generation iPhones, promising 40% better performance.',
    sourceUrl: 'https://example.com/apple-ai-chip',
    educationalNote: 'Hardware innovations in AI processing can significantly impact a company\'s competitive position and stock value.'
  },
  {
    id: '6',
    title: 'Apple announces new AI chip for iPhone',
    ticker: 'AAPL',
    sentiment: 'positive' as const,
    priceImpact: 2.5,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    company: 'Apple Inc.',
    summary: 'Apple has announced a breakthrough AI chip that will power next-generation iPhones, promising 40% better performance.',
    sourceUrl: 'https://example.com/apple-ai-chip',
    educationalNote: 'Hardware innovations in AI processing can significantly impact a company\'s competitive position and stock value.'
  },
])

const stockData = ref([
  { date: '2024-01-01', price: 150 },
  { date: '2024-01-05', price: 155 },
  { date: '2024-01-10', price: 152 },
  { date: '2024-01-15', price: 158 },
  { date: '2024-01-20', price: 162 },
  { date: '2024-01-25', price: 165 },
  { date: '2024-01-30', price: 168 }
])

const handleNewsClick = (news: any) => {
  selectedNews.value = news
}

const closeNewsDetail = () => {
  selectedNews.value = null
}

</script>

<template>
  <main class="main-container">
    <div class="content-wrapper">
        <!-- Header -->
        <div class="header-section">
            <p class="text-grey-darken-1">Latest news affecting your AI portfolio companies</p>
        </div>

        <!-- Split View -->
        <div class="split-layout">
          <!-- Left Side - News List -->
          <div class="news-section">
            <NewsCard
              v-for="item in newsItems"
              :key="item.id"
              :news="item"
              @click="handleNewsClick"
            />
          </div>

          <!-- Right Side - Empty -->
          <div class="empty-section">
            <!-- Empty space -->
          </div>
        </div>

        <!-- Popup Dialog -->
        <NewsDescription
          :news="selectedNews"
          :stock-data="stockData"
          @close="closeNewsDetail"
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