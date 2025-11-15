<template>
  <v-dialog v-model="model" max-width="700">
    <v-card v-if="holding" rounded="lg">
      <v-card-title class="d-flex align-center pa-4">
        <span class="text-h5 font-weight-medium"> {{ holding.name }} ({{ holding.ticker }}) </span>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" @click="emit('close')"></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <v-col>
          <v-row class="ga-5 justify-center">
            <v-card title="Total Shares Bought"> 1200 </v-card>
            <v-card title="Total Shares Sold"> 0 </v-card>
            <v-card title="Net Position"> 1200 Shares</v-card>
          </v-row>
          <p class="mt-7 ml-7">All Transactions</p>
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
