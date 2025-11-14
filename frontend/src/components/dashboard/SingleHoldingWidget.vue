<template>
  <v-card
    variant="outlined"
    rounded="lg"
    class="pa-4 cursor-pointer"
    hover
    @click="$emit('click', holding)"
  >
    <v-row align="center" justify="space-between">
      <v-col cols="auto">
        <div class="d-flex align-center ga-3">
          <v-avatar color="grey-lighten-3" size="48" rounded="lg">
            <span class="text-h6 font-weight-bold">{{ holding.ticker.substring(0, 2) }}</span>
          </v-avatar>
          <div>
            <div class="text-body-1 font-weight-medium">{{ holding.name }}</div>
            <div class="text-body-2 text-medium-emphasis">{{ holding.ticker }}</div>
          </div>
        </div>
        <div class="text-body-2 text-medium-emphasis mt-3">
          {{ holding.shares.toLocaleString() }} shares @ avg ${{ holding.avgPrice.toFixed(2) }}
        </div>
      </v-col>

      <v-col cols="auto" class="text-right">
        <div class="text-h6 font-weight-medium mb-1">
          ${{ holding.totalValue.toLocaleString() }}
        </div>
        <div :class="gainLossColor" class="text-body-2">
          {{ isPositive ? '+' : '' }}${{ Math.abs(gainLoss).toLocaleString() }} ({{
            isPositive ? '+' : ''
          }}{{ gainLossPercent.toFixed(2) }}%)
        </div>
      </v-col>
    </v-row>
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

const gainLossColor = computed(() => (isPositive.value ? 'text-green-600' : 'text-red-600'))
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
