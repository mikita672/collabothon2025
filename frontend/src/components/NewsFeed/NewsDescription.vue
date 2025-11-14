<template>
  <v-dialog 
    :model-value="!!news" 
    @update:model-value="handleClose"
    max-width="700"
    scrollable
  >
    <v-card v-if="news" class="dialog-card">
      <!-- Header -->
      <v-card-title class="px-0 pt-0 pb-0">
        <div class="dialog-header">
          <h2 class="text-h6 font-weight-bold">{{ news.title }}</h2>
        </div>
      </v-card-title>

      <v-card-text class="px-0 py-0">
        <div class="content-sections">
          <!-- Badges -->
          <div class="d-flex align-center flex-wrap mb-4" style="gap: 8px;">
            <v-chip size="x-small" variant="outlined" class="badge-text">
              {{ news.ticker }}
            </v-chip>
            <v-chip 
              size="x-small"
              :class="isPositive ? 'sentiment-positive' : 'sentiment-negative'"
              class="badge-text"
            >
              {{ news.sentiment }}
            </v-chip>
            <v-chip 
              size="x-small"
              variant="outlined"
              :class="isPositive ? 'price-positive' : 'price-negative'"
              class="badge-text"
            >
              <v-icon 
                start
                :icon="isPositive ? 'mdi-trending-up' : 'mdi-trending-down'" 
                size="10"
              ></v-icon>
              {{ news.priceImpact > 0 ? '+' : '' }}{{ news.priceImpact }}% price impact
            </v-chip>
          </div>

          <!-- Summary -->
          <div class="mb-4">
            <h3 class="text-body-1 font-weight-bold mb-2">Summary</h3>
            <p class="text-body-2 text-grey-darken-1 mb-2" style="line-height: 1.5;">{{ news.summary }}</p>
            <v-btn 
              variant="text" 
              color="primary"
              class="px-0 link-button"
              size="small"
              @click="openSource"
            >
              Read original source
              <v-icon end size="14">mdi-open-in-new</v-icon>
            </v-btn>
          </div>

          <!-- Stock Chart -->
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
                <h3 class="text-body-1 font-weight-bold mb-1 education-title">
                  Why This Matters
                </h3>
                <p class="text-body-2 education-text" style="line-height: 1.4;">
                  {{ news.educationalNote }}
                </p>
              </div>
            </div>
          </v-card>

          <!-- Close Button -->
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

<script setup lang="ts">
import { computed, watch, ref, onUnmounted } from 'vue';

interface StockDataPoint {
  date: string;
  price: number;
}

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
  news: NewsItem | null;
  stockData: StockDataPoint[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: any = null;

const isPositive = computed(() => props.news?.sentiment === 'positive');

const handleClose = () => {
  emit('close');
};

const openSource = () => {
  if (props.news?.sourceUrl) {
    window.open(props.news.sourceUrl, '_blank');
  }
};

// Simple chart rendering (you can integrate a proper chart library like Chart.js if needed)
watch(() => props.news, (newNews) => {
  if (newNews && chartCanvas.value && props.stockData.length > 0) {
    drawChart();
  }
}, { immediate: true });

const drawChart = () => {
  if (!chartCanvas.value || !props.stockData.length) return;
  
  const canvas = chartCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size with higher DPI for clarity
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 200 * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = '200px';
  ctx.scale(dpr, dpr);

  const padding = 50;
  const width = rect.width - padding * 2;
  const height = 200 - padding * 2;

  const prices = props.stockData.map(d => d.price);
  const minPrice = Math.min(...prices) - 10;
  const maxPrice = Math.max(...prices) + 10;
  const priceRange = maxPrice - minPrice;

  ctx.clearRect(0, 0, rect.width, 200);

  // Draw grid lines
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding + (height / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(rect.width - padding, y);
    ctx.stroke();
  }

  // Draw X-axis dates
  ctx.fillStyle = '#6b7280';
  ctx.font = '11px system-ui';
  ctx.textAlign = 'center';
  props.stockData.forEach((point, index) => {
    if (index % Math.ceil(props.stockData.length / 5) === 0) {
      const x = padding + (width / (props.stockData.length - 1)) * index;
      const date = new Date(point.date);
      ctx.fillText(`${date.getMonth() + 1}/${date.getDate()}`, x, 200 - 8);
    }
  });

  // Draw Y-axis labels
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const y = padding + (height / 4) * i;
    const price = maxPrice - (priceRange / 4) * i;
    ctx.fillText('$' + price.toFixed(0), padding - 10, y + 4);
  }

  // Draw line
  ctx.strokeStyle = isPositive.value ? '#10b981' : '#ef4444';
  ctx.lineWidth = 2;
  ctx.beginPath();

  props.stockData.forEach((point, index) => {
    const x = padding + (width / (props.stockData.length - 1)) * index;
    const y = padding + height - ((point.price - minPrice) / priceRange) * height;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
};

onUnmounted(() => {
  if (chartInstance) {
    chartInstance = null;
  }
});
</script>

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
  font-size: 0.75rem !important;
  height: 18px !important;
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

.price-positive {
  color: #15803d !important;
  border-color: #86efac !important;
}

.price-negative {
  color: #991b1b !important;
  border-color: #fca5a5 !important;
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

.education-title {
  color: #1e3a8a;
}

.education-text {
  color: #1e40af;
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
