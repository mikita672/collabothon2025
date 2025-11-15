<template>
  <v-card class="holding-card pa-0" elevation="0" @click="$emit('click', holding)">
    <div class="d-flex align-center justify-space-between" style="gap: 12px">
      <div class="d-flex align-center" style="gap: 12px">
        <v-avatar
          size="48"
          rounded="circle"
          :color="iconColor"
          class="d-flex align-center justify-center"
        >
          <v-img v-if="holding.ticker === 'NVDA'" :src="nvidiaIcon" width="28" height="28" />
          <v-img v-else-if="holding.ticker === 'AMZN'" :src="amazonIcon" width="28" height="28" />
          <v-icon v-else size="28" color="white">{{ iconName }}</v-icon>
        </v-avatar>

        <div>
          <div class="company-name">{{ holding.name }}</div>
          <div class="meta-text">
            {{ formatShares(holding.shares) }} {{ holding.ticker }} ·
            {{ formatCurrency(holding.avgPrice) }}
          </div>
        </div>
      </div>

      <div class="text-right">
        <div class="value-text">{{ formatCurrency(holding.totalValue) }}</div>
        <div :class="['percentage-text', percentageClass]">
          <v-icon size="14" class="mr-1">{{
            isPositive ? 'mdi-trending-up' : 'mdi-trending-down'
          }}</v-icon>
          {{ formattedPercentage }}
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import nvidiaIcon from '@/assets/company-icons/Nvidia_logo.png'
import amazonIcon from '@/assets/company-icons/amazon.png'

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

const iconMap: Record<string, { icon: string; color: string }> = {
  AMZN: { icon: amazonIcon, color: '#666666' },
  GOOGL: { icon: 'mdi-google', color: '#666666' },
  GOOG: { icon: 'mdi-google', color: '#666666' },
  NVDA: { icon: nvidiaIcon, color: '#666666' },
  AAPL: { icon: 'mdi-apple', color: '#666666' },
  MSFT: { icon: 'mdi-microsoft', color: '#666666' },
}

const iconName = computed(() => iconMap[props.holding.ticker]?.icon ?? 'mdi-domain')
const iconColor = computed(() => iconMap[props.holding.ticker]?.color ?? '#9ca3af')

const gainLoss = computed(
  () => props.holding.totalValue - props.holding.shares * props.holding.avgPrice,
)

const gainLossPercent = computed(
  () => ((props.holding.currentPrice - props.holding.avgPrice) / props.holding.avgPrice) * 100,
)

const isPositive = computed(() => gainLossPercent.value >= 0)

const percentageClass = computed(() => (isPositive.value ? 'positive' : 'negative'))

const formattedPercentage = computed(() => {
  const sign = isPositive.value ? '+' : ''
  return `${sign}${gainLossPercent.value.toFixed(2)}%`
})

const formatShares = (n: number) => {
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })
}

const formatCurrency = (n: number) => {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}
</script>

<style scoped>
.holding-card {
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.holding-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  border-color: #d1d5db;
}

.company-name {
  font-family: 'Afacad', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #000;
}

.meta-text {
  font-family: 'Afacad', sans-serif;
  font-size: 13px;
  color: #9ca3af;
}

.value-text {
  font-family: 'Afacad', sans-serif;
  font-size: 16px;
  color: #6b7280;
  font-weight: 400;
}

.percentage-text {
  font-family: 'Afacad', sans-serif;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-weight: 500;
}

.percentage-text.positive {
  color: #16a34a;
}

.percentage-text.negative {
  color: #dc2626;
}
</style>
