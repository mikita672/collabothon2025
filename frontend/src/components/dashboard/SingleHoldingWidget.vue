<template>
  <v-card 
    class="holding-card pa-4" 
    elevation="0"
    @click="$emit('click', holding)"
  >
    <div class="d-flex align-start" style="gap: 12px;">
      <!-- Avatar -->
      <div class="flex-shrink-0 mt-1">
        <v-avatar color="grey-lighten-3" size="40" rounded="lg">
          <span class="text-subtitle-1 font-weight-bold">{{ holding.ticker.substring(0, 2) }}</span>
        </v-avatar>
      </div>

      <!-- Content -->
      <div class="flex-grow-1" style="min-width: 0;">
        <div class="d-flex justify-space-between align-center mb-2">
          <div class="text-body-1 font-weight-medium text-grey-darken-4">{{ holding.name }}</div>
          <div class="text-body-1 font-weight-medium text-grey-darken-4">
            ${{ holding.totalValue.toLocaleString() }}
          </div>
        </div>

        <div class="d-flex align-center flex-wrap" style="gap: 8px;">
          <!-- Ticker Badge -->
          <v-chip 
            size="x-small" 
            variant="outlined"
            class="badge-text"
          >
            {{ holding.ticker }}
          </v-chip>

          <!-- Shares Badge -->
          <v-chip 
            size="x-small" 
            variant="outlined"
            class="badge-text"
          >
            {{ holding.shares.toLocaleString() }} shares
          </v-chip>

          <!-- Gain/Loss Badge -->
          <v-chip 
            size="x-small"
            variant="outlined"
            :class="gainLossBadgeClass"
            class="badge-text"
          >
            {{ isPositive ? '+' : '' }}{{ gainLossPercent.toFixed(2) }}%
          </v-chip>

           <!-- Avg Price -->
           <div class="d-flex align-center text-grey text-caption">
            Avg: ${{ holding.avgPrice.toFixed(2) }}
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Holding {
  id: string
  name: string
  ticker: string
  shares: number
  avgPrice: number
  currentPrice: number
  totalValue: number
}

interface Props {
  holding: Holding
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: [holding: Holding]
}>()

const gainLoss = computed(
  () => props.holding.totalValue - props.holding.shares * props.holding.avgPrice,
)

const gainLossPercent = computed(
  () => ((props.holding.currentPrice - props.holding.avgPrice) / props.holding.avgPrice) * 100,
)

const isPositive = computed(() => gainLoss.value >= 0)

const gainLossBadgeClass = computed(() => {
  return isPositive.value ? 'price-positive' : 'price-negative';
});
</script>

<style scoped>
.holding-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
  background: white;
}

.holding-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  border-color: #d1d5db;
}

.badge-text {
  font-size: 0.75rem !important;
  height: 20px !important;
  font-weight: 500;
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
