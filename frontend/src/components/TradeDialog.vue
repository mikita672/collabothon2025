<template>
  <v-dialog 
    :model-value="show" 
    @update:model-value="$emit('close')"
    max-width="400"
  >
    <v-card class="trade-dialog">
      <v-card-title class="px-4 pt-4 pb-2">
        <div class="d-flex align-center justify-space-between">
          <h3 class="text-h6 font-weight-bold">{{ title }}</h3>
          <v-btn 
            icon="mdi-close" 
            variant="text" 
            size="small"
            @click="$emit('close')"
          ></v-btn>
        </div>
      </v-card-title>

      <v-card-text class="px-4 pb-4">
        <!-- Stock Info -->
        <div class="stock-info mb-3 pa-2">
          <div class="d-flex justify-space-between align-center mb-1">
            <span class="text-caption text-grey-darken-1">Stock</span>
            <span class="text-body-1 font-weight-bold">{{ ticker }}</span>
          </div>
          <div class="d-flex justify-space-between align-center" :class="action === 'sell' && ownedQuantity > 0 ? 'mb-1' : ''">
            <span class="text-caption text-grey-darken-1">Current Price</span>
            <span class="text-body-1 font-weight-bold">${{ currentPrice.toFixed(2) }}</span>
          </div>
          <div v-if="action === 'sell' && ownedQuantity > 0" class="d-flex justify-space-between align-center">
            <span class="text-caption text-grey-darken-1">You Own</span>
            <span class="text-caption font-weight-medium">{{ ownedQuantity }} shares</span>
          </div>
        </div>

        <!-- Amount Input -->
        <div class="mb-3">
          <label class="text-caption text-grey-darken-2 mb-1 d-block">Amount to {{ action === 'buy' ? 'Spend' : 'Sell' }} ($)</label>
          <v-text-field
            v-model="amountInput"
            type="number"
            variant="outlined"
            density="compact"
            prefix="$"
            placeholder="Enter amount"
            hide-details
          ></v-text-field>
        </div>

        <!-- Quantity Display -->
        <div class="quantity-display mb-3 pa-2">
          <div class="d-flex justify-space-between align-center">
            <span class="text-caption text-grey-darken-1">Shares</span>
            <span class="text-body-1 font-weight-bold">{{ calculatedQuantity }}</span>
          </div>
          <div class="d-flex justify-space-between align-center mt-1">
            <span class="text-caption text-grey-darken-1">Total Cost</span>
            <span class="text-body-1 font-weight-bold">${{ totalCost.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Balance Info -->
        <div class="balance-info mb-3 pa-2">
          <div class="d-flex justify-space-between align-center">
            <span class="text-caption text-grey-darken-1">Current Balance</span>
            <span class="text-caption font-weight-medium">${{ balance.toFixed(2) }}</span>
          </div>
          <div v-if="action === 'buy'" class="d-flex justify-space-between align-center mt-1">
            <span class="text-caption text-grey-darken-1">After {{ action }}</span>
            <span class="text-caption font-weight-medium" :class="balanceAfter >= 0 ? 'text-success' : 'text-error'">
              ${{ balanceAfter.toFixed(2) }}
            </span>
          </div>
        </div>

        <!-- Error Message -->
        <v-alert v-if="errorMessage" type="error" variant="tonal" density="compact" class="mb-3 text-caption">
          {{ errorMessage }}
        </v-alert>

        <!-- Action Buttons -->
        <v-btn 
          color="success"
          size="small"
          block
          :disabled="!canTrade"
          :loading="loading"
          @click="handleTrade"
        >
          <v-icon start size="18">mdi-cart-plus</v-icon>
          Buy Stock
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'

interface Props {
  show: boolean
  action: 'buy' | 'sell'
  ticker: string
  currentPrice: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  success: []
}>()

const portfolioStore = usePortfolioStore()

const amountInput = ref<string>('')
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const balance = computed(() => portfolioStore.balance)
const ownedQuantity = computed(() => portfolioStore.getStockQuantity(props.ticker))

const amount = computed(() => {
  const parsed = parseFloat(amountInput.value)
  return isNaN(parsed) ? 0 : parsed
})

const calculatedQuantity = computed(() => {
  if (!amount.value || !props.currentPrice) return 0
  return Math.floor(amount.value / props.currentPrice)
})

const totalCost = computed(() => {
  return calculatedQuantity.value * props.currentPrice
})

const balanceAfter = computed(() => {
  if (props.action === 'buy') {
    return balance.value - totalCost.value
  } else {
    return balance.value + totalCost.value
  }
})

const canTrade = computed(() => {
  if (calculatedQuantity.value <= 0) return false
  
  if (props.action === 'buy') {
    return balanceAfter.value >= 0
  } else {
    return calculatedQuantity.value <= ownedQuantity.value
  }
})

const title = computed(() => {
  return props.action === 'buy' ? 'Buy Stock' : 'Sell Stock'
})

const handleTrade = async () => {
  if (!canTrade.value) return

  loading.value = true
  errorMessage.value = null

  try {
    let result
    if (props.action === 'buy') {
      result = await portfolioStore.buyStock(props.ticker, calculatedQuantity.value, props.currentPrice)
    } else {
      result = await portfolioStore.sellStock(props.ticker, calculatedQuantity.value, props.currentPrice)
    }

    if (result.success) {
      emit('success')
      emit('close')
      amountInput.value = ''
    } else {
      errorMessage.value = result.error || 'Trade failed'
    }
  } catch (err) {
    errorMessage.value = 'An error occurred'
  } finally {
    loading.value = false
  }
}

watch(() => props.show, (newVal) => {
  if (!newVal) {
    amountInput.value = ''
    errorMessage.value = null
  }
})

// Watch for validation
watch([amount, calculatedQuantity], () => {
  errorMessage.value = null
  
  if (props.action === 'buy' && totalCost.value > balance.value) {
    errorMessage.value = 'Insufficient balance'
  } else if (props.action === 'sell' && calculatedQuantity.value > ownedQuantity.value) {
    errorMessage.value = 'Insufficient stock quantity'
  }
})
</script>

<style scoped>
.trade-dialog {
  border-radius: 12px !important;
}

.stock-info {
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.quantity-display {
  background: #e8f5e9;
  border-radius: 8px;
  border: 1px solid #c8e6c9;
}

.balance-info {
  background: #fff3e0;
  border-radius: 8px;
  border: 1px solid #ffe0b2;
}
</style>
