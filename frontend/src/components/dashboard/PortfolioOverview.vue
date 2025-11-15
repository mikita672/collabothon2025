<template>
  <div>
    <v-card rounded="lg">
      <div v-if="loading" class="d-flex justify-center align-center pa-5">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else-if="error" class="pa-5 text-center text-error">
        {{ error }}
      </div>
      <div v-else-if="holdings.length === 0" class="pa-5 text-center text-medium-emphasis">
        No holdings yet. Start investing to see your portfolio!
      </div>
      <div v-else class="d-flex flex-column ga-3 pa-5">
        <SingleHoldingWidget
          v-for="holding in holdings"
          :key="holding.id"
          :holding="holding"
          @click="handleHoldingClick"
        />
      </div>
    </v-card>

    <HoldingPopup v-model="isDialogOpen" :holding="selectedHolding" @close="isDialogOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import SingleHoldingWidget from '@/components/Dashboard/SingleHoldingWidget.vue'
import HoldingPopup from '@/components/Dashboard/HoldingPopup.vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { PortfolioService } from '@/services/portfolio'
import type { Holding } from '@/types/holding'

const portfolioStore = usePortfolioStore()

const holdings = ref<Holding[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const isDialogOpen = ref(false)
const selectedHolding = ref<Holding | null>(null)

const loadHoldings = async () => {
  loading.value = true
  error.value = null

  try {
    const stocks = portfolioStore.stocks
    if (stocks && stocks.length > 0) {
      holdings.value = await PortfolioService.getHoldings(stocks, portfolioStore.currentStockPrices)
    } else {
      holdings.value = []
    }
  } catch (err) {
    error.value = 'Failed to load holdings'
    console.error('Error loading holdings:', err)
  } finally {
    loading.value = false
  }
}

const handleHoldingClick = (holding: Holding) => {
  selectedHolding.value = holding
  isDialogOpen.value = true
}

watch(() => portfolioStore.stocks, loadHoldings, { deep: true })
watch(() => portfolioStore.simulationData, loadHoldings, { deep: true })

onMounted(async () => {
  await loadHoldings()
})

import { onUnmounted } from 'vue'
onUnmounted(() => {})
</script>
