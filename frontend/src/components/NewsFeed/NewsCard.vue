<script setup lang="ts">
import { computed, toRef } from 'vue';
import type { NewsItem } from '@/types/news';
import { useSentiment } from '@/composables/useSentiment';
import { formatTimeAgo } from '@/utils/formatters';

interface Props {
  news: NewsItem;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  click: [news: NewsItem];
}>();

// Use sentiment composable
const newsRef = toRef(props, 'news');
const {
  sentimentIcon,
  sentimentColor,
  sentimentStyle,
  priceImpactIcon,
  priceImpactStyle,
} = useSentiment(newsRef);

// Time formatting
const formattedTime = computed(() => formatTimeAgo(props.news.timestamp));

const handleClick = () => {
  emit('click', props.news);
};
</script>

<template>
  <v-card 
    rounded="lg"
    class="news-card pa-4" 
    elevation="0"
    @click="handleClick"
    style="font-family: Afacad; color: #002e3c"
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
        <div class="text-body-1 text-grey-darken-4 mb-2 text-h5">
          {{ news.title }}
        </div>

        <div class="d-flex align-center flex-wrap" style="gap: 8px;">
          <!-- Ticker Badge -->
          <v-chip 
            size="x-small" 
            variant="outlined"
            class="badge-text text-h5 font-weight-bold text-center"
          >
            {{ news.ticker }}
          </v-chip>

          <!-- Sentiment Badge -->
          <v-chip 
            :key="`sentiment-${news.id}-${news.sentiment}`"
            size="x-small"
            :style="sentimentStyle"
            class="badge-text text-h5 font-weight-bold text-center"
          >
            {{ news.sentiment }}
          </v-chip>

          <!-- Price Impact Badge -->
          <v-chip 
            v-if="news.priceImpact !== 0"
            :key="`price-${news.id}-${news.priceImpact}`"
            size="x-small"
            variant="outlined"
            :style="priceImpactStyle"
            class="badge-text text-h5 font-weight-bold text-center"
          >
            <v-icon 
              start
              :icon="priceImpactIcon" 
              size="10"
            ></v-icon>
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
  border: 1px solid #86efac !important;
}

.sentiment-negative {
  background-color: #fee2e2 !important;
  color: #991b1b !important;
  border: 1px solid #fca5a5 !important;
}

.sentiment-neutral {
  background-color: #f3f4f6 !important;
  color: #374151 !important;
  border: 1px solid #d1d5db !important;
}

.price-positive {
  color: #15803d !important;
  border-color: #86efac !important;
  background-color: rgba(220, 252, 231, 0.3) !important;
}

.price-negative {
  color: #991b1b !important;
  border-color: #fca5a5 !important;
  background-color: rgba(254, 226, 226, 0.3) !important;
}

.price-neutral {
  color: #6b7280 !important;
  border-color: #d1d5db !important;
  background-color: rgba(243, 244, 246, 0.3) !important;
}
</style>
