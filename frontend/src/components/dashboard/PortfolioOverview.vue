<template>
  <div>
    <v-card rounded="lg">
      <div class="d-flex flex-column ga-3 pa-5">
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
import { ref } from 'vue'
import SingleHoldingWidget from '@/components/Dashboard/SingleHoldingWidget.vue'
import HoldingPopup from '@/components/Dashboard/HoldingPopup.vue'
import type { Holding } from '@/types/holding'

const holdings = ref<Holding[]>([
  {
    id: '1',
    name: 'NVIDIA Corporation',
    ticker: 'NVDA',
    shares: 500,
    avgPrice: 450.0,
    currentPrice: 495.5,
    totalValue: 247750,
  },
  {
    id: '2',
    name: 'Microsoft Corporation',
    ticker: 'MSFT',
    shares: 300,
    avgPrice: 380.0,
    currentPrice: 405.25,
    totalValue: 121575,
  },
  {
    id: '3',
    name: 'Apple Inc.',
    ticker: 'AAPL',
    shares: 1000,
    avgPrice: 175.5,
    currentPrice: 185.3,
    totalValue: 185300,
  },
  {
    id: '4',
    name: 'Amazon',
    ticker: 'AMZN',
    shares: 1000,
    avgPrice: 175.5,
    currentPrice: 185.3,
    totalValue: 185300,
  },
])

const isDialogOpen = ref(false)
const selectedHolding = ref<Holding | null>(null)

const handleHoldingClick = (holding: Holding) => {
  selectedHolding.value = holding
  isDialogOpen.value = true
}
</script>
