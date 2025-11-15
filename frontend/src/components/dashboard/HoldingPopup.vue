<template>
  <v-dialog v-model="model" max-width="700">
    <v-card v-if="holding" rounded="lg">
      <v-card-title class="d-flex align-center pa-4">
        <span class="text-h5 font-weight-medium" style="font-family: afacad">
          {{ holding.name }} ({{ holding.ticker }})
        </span>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" @click="emit('close')"></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <v-col>
          <v-row class="mb-4">
            <v-col cols="12" sm="4">
              <v-sheet class="pa-4 text-center rounded-lg" border>
                <div class="text-caption text-medium-emphasis" style="font-family: afacad">
                  Total Shares Bought
                </div>
                <div class="text-h6 font-weight-bold" style="font-family: afacad">1200</div>
              </v-sheet>
            </v-col>
            <v-col cols="12" sm="4">
              <v-sheet class="pa-4 text-center rounded-lg" border>
                <div class="text-caption text-medium-emphasis" style="font-family: afacad">
                  Total Shares Sold
                </div>
                <div class="text-h6 font-weight-bold" style="font-family: afacad">0</div>
              </v-sheet>
            </v-col>
            <v-col cols="12" sm="4">
              <v-sheet class="pa-4 text-center rounded-lg" border>
                <div class="text-caption text-medium-emphasis" style="font-family: afacad">
                  Net Position
                </div>
                <div class="text-h6 font-weight-bold" style="font-family: afacad">1200 shares</div>
              </v-sheet>
            </v-col>
          </v-row>
          <div class="text-subtitle-1 font-weight-medium mb-3" style="font-family: afacad">
            All Transactions
          </div>

          <TransactionsHistory />
        </v-col>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn class="close-button" @click="emit('close')"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import TransactionsHistory from './TransactionsHistory.vue'

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

const model = defineModel<boolean>()

const emit = defineEmits<{
  close: []
}>()

const formatShares = (n: number) => {
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })
}

const formatCurrency = (n: number) => {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}
</script>

<style scoped>
.close-button {
  border: 1px solid;
}
</style>
