<template>
  <v-card rounded="lg">
    <div class="d-flex flex-column ga-3">
      <SingleHoldingWidget
        v-for="holding in holdings"
        :key="holding.id"
        :holding="holding"
        @click="handleHoldingClick"
      />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SingleHoldingWidget from './SingleHoldingWidget.vue'

interface Holding {
  id: string
  name: string
  ticker: string
  shares: number
  avgPrice: number
  currentPrice: number
  totalValue: number
}

// Mock data - replace with props or API call later
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
])

const handleHoldingClick = (holding: Holding) => {
  console.log('Clicked on:', holding)
  // Handle click event - navigate to details, open dialog, etc.
}
</script>
