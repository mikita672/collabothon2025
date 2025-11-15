<template>
  <div>
    <div class="mb-4">
      <h1 style="font-family: afacad">Portfolio Allocation</h1>
      <h3 style="font-family: afacad" class="font-weight-light">Distribution of your investments</h3>
    </div>
    
    <v-card class="pa-6" rounded="lg">
    
    <div style="height: 350px">
      <Pie :data="chartData" :options="chartOptions" />
    </div>

    <v-row class="mt-4">
      <v-col
        v-for="(stock, index) in props.stocks"
        :key="stock.ticker"
        cols="6"
      >
        <div class="d-flex align-center ga-2">
          <div
            class="flex-shrink-0"
            :style="{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: COLORS[index % COLORS.length],
            }"
          />
          <div class="text-body-2">
            <span class="text-grey-darken-3">{{ stock.ticker }}</span>
            <span class="text-grey ml-1">({{ getPercentage(stock) }}%)</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'
import type { Stock } from '@/types/portfolio'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  stocks: Stock[]
  totalValue: number
}

const props = defineProps<Props>()

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']

const getStockValue = (stock: Stock) => {
  return stock.quantity * (stock.currentPrice || stock.purchasePrice)
}

const getPercentage = (stock: Stock) => {
  const value = getStockValue(stock)
  return ((value / props.totalValue) * 100).toFixed(1)
}

const chartData = computed(() => ({
  labels: props.stocks.map((s) => s.ticker),
  datasets: [
    {
      data: props.stocks.map((s) => getStockValue(s)),
      backgroundColor: COLORS.slice(0, props.stocks.length),
      borderWidth: 2,
      borderColor: '#ffffff',
    },
  ],
}))

const chartOptions = computed<ChartOptions<'pie'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const stock = props.stocks[context.dataIndex]
          if (!stock) return ''
          const value = getStockValue(stock)
          const percentage = getPercentage(stock)
          return [
            `${stock.ticker}`,
            `$${value.toLocaleString()}`,
            `${percentage}% of portfolio`,
          ]
        },
      },
    },
  },
}))
</script>
