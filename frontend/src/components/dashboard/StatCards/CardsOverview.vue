<template>
  <v-row class="ga-0 mx-0" style="margin-left: 0; margin-right: 0">
    <v-col class="pa-1">
      <TotalAllocatedWidget :current-balance="stats.currentBalance" />
    </v-col>
    <v-col class="pa-1">
      <TotalInvestedWidget :total-invested="stats.totalInvested" />
    </v-col>
    <v-col class="pa-1">
      <CurrentValueWidget :current-value="stats.currentValue" />
    </v-col>
  </v-row>
  <v-row class="ga-0 mx-0" style="margin-left: 0; margin-right: 0">
    <TotalGrowthWidget
      :total-growth="stats.totalGrowth"
      :growth-percentage="stats.growthPercentage"
    />
  </v-row>
</template>

<script setup lang="ts">
import type { PortfolioStats } from '@/types/portfolio'
import TotalInvestedWidget from '@/components/Dashboard/StatCards/TotalInvestedWidget.vue'
import CurrentValueWidget from '@/components/Dashboard/StatCards/CurrentValueWidget.vue'
import TotalAllocatedWidget from '@/components/Dashboard/StatCards/CurrentBalanceWidget.vue'
import TotalGrowthWidget from '@/components/Dashboard/StatCards/TotalGrowthWidget.vue'

defineProps<{
  stats: PortfolioStats
}>()
</script>
