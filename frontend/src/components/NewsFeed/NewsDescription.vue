<script setup lang="ts">
import { computed, toRef } from 'vue';
import type { NewsItem, StockDataPoint } from '@/types/news';
import { useSentiment } from '@/composables/useSentiment';
import { useStockChart } from '@/composables/useStockChart';

interface Props {
  news: NewsItem | null;
  stockData: StockDataPoint[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

// Use composables
const newsRef = toRef(props, 'news');
const stockDataRef = toRef(props, 'stockData');

const {
  isPositive,
  sentimentClass,
  priceImpactClass,
  priceImpactIcon: trendIcon,
} = useSentiment(newsRef);

const { chartCanvas } = useStockChart(newsRef, stockDataRef, isPositive);

const handleClose = () => {
  emit('close');
};

const openSource = () => {
  if (props.news?.sourceUrl) {
    window.open(props.news.sourceUrl, '_blank');
  }
};
</script>

<template>
  <v-dialog 
    :model-value="!!news" 
    @update:model-value="handleClose"
    max-width="500"
  >
    <v-card v-if="news" class="dialog-card">
      <v-card-title class="px-0 pt-0 pb-0">
        <div class="dialog-header">
          <h2 class="text-h8 font-weight-bold text-h8 font-weight-bold text-wrap" style="font-family: Afacad; color: #002e3c">{{ news.title }}</h2>
        </div>
      </v-card-title>

      <v-card-text class="px-0 py-0">
        <div class="content-sections">
          <!-- Badges -->
          <div class="d-flex align-center flex-wrap mb-4" style="gap: 8px; font-family: Afacad; color: #002e3c">
            <v-chip size="small" variant="outlined" class="badge-text">
              {{ news.ticker }}
            </v-chip>
            <v-chip 
              size="small"
              style="font-family: Afacad; color: #002e3c"
              :class="sentimentClass"
              class="badge-text"
            >
              {{ news.sentiment }}
            </v-chip>
            <v-chip 
              size="small"
              variant="outlined"
              :class="priceImpactClass"
              class="badge-text"
            >
              <v-icon 
                start
                :icon="trendIcon" 
                size="12"
              ></v-icon>
              {{ news.priceImpact > 0 ? '+' : '' }}{{ news.priceImpact }}% price impact
            </v-chip>
          </div>

          <!-- Summary -->
          <div class="mb-4">
            <h3 class="text-body-6 font-weight-bold mb-2" style="font-family: Afacad; color: #002e3c">Summary</h3>
            <p class="text-h6 text-grey-darken-1 mb-3" style="line-height: 1.5; font-family: Afacad; color: #002e3c; white-space: pre-wrap;">{{ news.summary }}</p>
            <v-btn 
              v-if="news.sourceUrl"
              variant="text" 
              color="primary"
              class="px-0 link-button font-weight-bold"
              @click="openSource"
            >
              Read original source  
              <v-icon end size="14">mdi-open-in-new</v-icon>
            </v-btn>
          </div>

          <!-- Chart -->
          <v-card variant="flat" class="pa-3 mb-4 chart-card">
            <h3 class="text-body-1 font-weight-bold mb-3">
              {{ news.company }} Stock Price (30 Days)
            </h3>
            <div class="chart-container">
              <canvas ref="chartCanvas"></canvas>
            </div>
          </v-card>

          <!-- Educational Note -->
          <v-card 
            class="pa-3 educational-card" 
            variant="flat"
          >
            <div class="d-flex align-start" style="gap: 10px;">
              <div class="education-icon">
                <v-icon color="white" size="18">mdi-school</v-icon>
              </div>
              <div class="flex-grow-1">
                <h3 class="text-body-1 font-weight-bold mb-1" style="line-height: 1.5; font-family: Afacad; color: #002e3c">
                  Why This Matters
                </h3>
                <p class="text-body-2" style="line-height: 1.4; font-family: Afacad; color: #002e3c">
                  {{ news.educationalNote }}
                </p>
              </div>
            </div>
          </v-card>

          <div class="d-flex justify-end mt-4">
            <v-btn 
              variant="outlined"
              size="small"
              @click="handleClose"
            >
              Close
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dialog-card {
  border-radius: 0 !important;
  overflow: hidden;
  max-height: 90vh;
  overflow-y: auto;
}

.dialog-header {
  padding: 1rem 1rem 0.75rem 1rem;
}

.content-sections {
  display: flex;
  flex-direction: column;
  padding: 0 1rem 1rem 1rem;
}

.badge-text {
  font-size: 0.875rem !important;
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

.price-neutral {
  color: #6b7280 !important;
  border-color: #d1d5db !important;
}

.link-button {
  text-transform: none !important;
  font-weight: 400 !important;
  font-size: 0.875rem !important;
}

.chart-card {
  background: white;
  border: 1px solid #e5e7eb;
}

.educational-card {
  background: linear-gradient(to bottom right, #eff6ff, #e0e7ff) !important;
  border: 1px solid #bfdbfe !important;
}

.education-icon {
  padding: 0.4rem;
  background: #3b82f6;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
}


.chart-container {
  position: relative;
  width: 100%;
  height: 200px;
}

.chart-container canvas {
  width: 100%;
  height: 200px;
  display: block;
}
</style>
