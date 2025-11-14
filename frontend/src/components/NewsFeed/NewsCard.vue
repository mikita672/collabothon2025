<template>
  <v-card 
    class="news-card pa-4" 
    elevation="0"
    @click="handleClick"
  >
    <div class="d-flex align-start" style="gap: 12px;">
      <!-- Sentiment Icon -->
      <div class="flex-shrink-0 mt-1">
        <v-icon 
          :color="sentimentColor" 
          size="16"
        >
          {{ sentimentIcon }}
        </v-icon>
      </div>

      <!-- Content -->
      <div class="flex-grow-1" style="min-width: 0;">
        <div class="text-body-1 text-grey-darken-4 mb-2">
          {{ news.title }}
        </div>

        <div class="d-flex align-center flex-wrap" style="gap: 8px;">
          <!-- Ticker Badge -->
          <v-chip 
            size="x-small" 
            variant="outlined"
            class="badge-text"
          >
            {{ news.ticker }}
          </v-chip>

          <!-- Sentiment Badge -->
          <v-chip 
            size="x-small"
            :class="sentimentBadgeClass"
            class="badge-text"
          >
            {{ news.sentiment }}
          </v-chip>

          <!-- Price Impact Badge -->
          <v-chip 
            v-if="news.priceImpact !== 0"
            size="x-small"
            variant="outlined"
            :class="priceImpactClass"
            class="badge-text"
          >
            {{ news.priceImpact > 0 ? '+' : '' }}{{ news.priceImpact }}%
          </v-chip>

          <!-- Timestamp -->
          <div class="d-flex align-center text-grey text-caption">
            <v-icon size="12" class="mr-1">mdi-clock-outline</v-icon>
            {{ formattedTime }}
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface NewsItem {
  id: string;
  title: string;
  ticker: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  priceImpact: number;
  timestamp: string;
  company: string;
  summary: string;
  sourceUrl: string;
  educationalNote: string;
}

interface Props {
  news: NewsItem;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  click: [news: NewsItem];
}>();

const sentimentIcon = computed(() => {
  switch (props.news.sentiment) {
    case 'positive':
      return 'mdi-trending-up';
    case 'negative':
      return 'mdi-trending-down';
    default:
      return 'mdi-minus';
  }
});

const sentimentColor = computed(() => {
  switch (props.news.sentiment) {
    case 'positive':
      return '#059669';
    case 'negative':
      return '#dc2626';
    default:
      return '#6b7280';
  }
});

const sentimentBadgeClass = computed(() => {
  switch (props.news.sentiment) {
    case 'positive':
      return 'sentiment-positive';
    case 'negative':
      return 'sentiment-negative';
    default:
      return 'sentiment-neutral';
  }
});

const priceImpactClass = computed(() => {
  return props.news.priceImpact > 0 ? 'price-positive' : 'price-negative';
});

const formattedTime = computed(() => {
  const date = new Date(props.news.timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHrs < 1) return 'Just now';
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
});

const handleClick = () => {
  emit('click', props.news);
};
</script>

<style scoped>
.news-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
  background: white;
}

.news-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  border-color: #d1d5db;
}

.badge-text {
  font-size: 0.75rem !important;
  height: 20px !important;
  font-weight: 500;
}

.sentiment-positive {
  background-color: #dcfce7 !important;
  color: #15803d !important;
}

.sentiment-negative {
  background-color: #fee2e2 !important;
  color: #991b1b !important;
}

.sentiment-neutral {
  background-color: #f3f4f6 !important;
  color: #374151 !important;
}

.price-positive {
  color: #15803d !important;
  border-color: #86efac !important;
}

.price-negative {
  color: #991b1b !important;
  border-color: #fca5a5 !important;
}
</style>
