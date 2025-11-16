<template>
  <div>
    <div v-if="loading" class="d-flex justify-center align-center pa-5">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-else-if="error" class="pa-5 text-center text-error">
      {{ error }}
    </div>
    <div v-else-if="transactions.length === 0" class="pa-5 text-center text-medium-emphasis">
      No transactions yet. Your transaction history will appear here.
    </div>
    <div v-else class="d-flex flex-column ga-3">
      <v-card v-for="transaction in transactions" :key="transaction.id" class="pa-4 outlined-card">
        <v-row no-gutters class="align-center mb-2">
          <v-col cols="auto" class="mr-3"> </v-col>

          <v-col>
            <v-row no-gutters align="center">
              <v-card
                :color="transaction.type === 'buy' ? 'light-green-lighten-4' : 'red-lighten-4'"
                class="pa-1"
                variant="flat"
                rounded="lg"
                size="36"
              >
                <div
                  :class="transaction.type === 'buy' ? 'text-green' : 'text-red'"
                  class="my-0 mx-2"
                  style="font-weight: 600; font-family: afacad"
                >
                  {{ transaction.type.toUpperCase() }}
                </div>
              </v-card>
              <div class="text-subtitle-1 font-weight-medium ml-5" style="font-family: afacad">
                {{ transaction.ticker }}: {{ transaction.quantity }} shares @ ${{
                  transaction.price.toFixed(2)
                }}
              </div>
            </v-row>
          </v-col>
        </v-row>

        <div class="d-flex align-center text-caption text-medium-emphasis mb-3">
          <v-icon size="small" class="mr-1" style="font-family: afacad">mdi-clock-outline</v-icon>
          {{ formatDate(transaction.date) }}
        </div>

        <div class="text-subtitle-1 text-right font-weight-medium mt-4" style="font-family: afacad">
          Total value: ${{ formatNumber(transaction.totalValue) }}
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { PortfolioService } from '@/services/portfolio'
import type { Transaction } from '@/types/portfolio'

const portfolioStore = usePortfolioStore()

const transactions = ref<Transaction[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadTransactions = async () => {
  loading.value = true
  error.value = null

  try {
    const stocks = portfolioStore.stocks
    if (stocks && stocks.length > 0) {
      const allTransactions = PortfolioService.getTransactions(stocks)
      transactions.value = allTransactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
    } else {
      transactions.value = []
    }
  } catch (err) {
    error.value = 'Failed to load transactions'
    console.error('Error loading transactions:', err)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatNumber = (value: number): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Load transactions when portfolio stocks change
watch(() => portfolioStore.stocks, loadTransactions, { deep: true })

// Initial load
onMounted(() => {
  loadTransactions()
})
</script>

<style scoped>
.outlined-card {
  box-shadow: none;
  border: 1px solid #e5e7eb;
}
</style>
