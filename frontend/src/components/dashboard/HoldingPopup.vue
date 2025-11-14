<template>
  <v-dialog v-model="model" max-width="600" persistent>
    <v-card v-if="holding" rounded="lg">
      <v-card-title class="d-flex align-center pa-4">
        <span class="text-h5 font-weight-medium"> {{ holding.name }} ({{ holding.ticker }}) </span>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" @click="emit('close')"></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-row>
          <v-col>
            <div class="text-caption text-medium-emphasis">Total Value</div>
            <div class="text-h6">{{ formatCurrency(holding.totalValue) }}</div>
          </v-col>
          <v-col>
            <div class="text-caption text-medium-emphasis">Shares</div>
            <div class="text-h6">{{ formatShares(holding.shares) }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div class="text-caption text-medium-emphasis">Avg. Buy Price</div>
            <div class="text-h6">{{ formatCurrency(holding.avgPrice) }}</div>
          </v-col>
          <v-col>
            <div class="text-caption text-medium-emphasis">Current Price</div>
            <div class="text-h6">{{ formatCurrency(holding.currentPrice) }}</div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-btn color="grey-darken-1" variant="text" @click="emit('close')"> Close </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="flat"> Trade </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
// Using defineProps for the holding
interface Holding {
  id: string
  name: string
  ticker: string
  shares: number
  avgPrice: number
  currentPrice: number
  totalValue: number
}
defineProps<{
  holding: Holding | null
}>()

// Using v-model for the dialog state
const model = defineModel<boolean>()

// Emitting 'close' is a clean way to let the parent close the dialog
const emit = defineEmits<{
  close: []
}>()

// --- Helper Functions (copied from your widget) ---
const formatShares = (n: number) => {
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })
}

const formatCurrency = (n: number) => {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}
</script>
